// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { DateTime } from 'luxon';
import { Logger } from 'winston';
import { StringValue } from 'google-protobuf/google/protobuf/wrappers_pb';

import { IServiceProvider } from '@dolittle/sdk.dependencyinversion';
import { EventContext, EventSourceId, EventType, IEventTypes } from '@dolittle/sdk.events';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { Internal, MissingEventInformation } from '@dolittle/sdk.events.processing';
import { Artifacts, ExecutionContexts, Guids } from '@dolittle/sdk.protobuf';
import { Cancellation } from '@dolittle/sdk.resilience';
import { IReverseCallClient, reactiveDuplex, ReverseCallClient } from '@dolittle/sdk.services';

import { Failure } from '@dolittle/contracts/Protobuf/Failure_pb';
import { ProcessorFailure, RetryProcessingState } from '@dolittle/runtime.contracts/Events.Processing/Processors_pb';
import { ProjectionsClient } from '@dolittle/runtime.contracts/Events.Processing/Projections_grpc_pb';
import {
    EventPropertyKeySelector as ProtobufEventPropertyKeySelector, EventSourceIdKeySelector as ProtobufEventSourceIdKeySelector, PartitionIdKeySelector as ProtobufPartitionIdKeySelector, ProjectionClientToRuntimeMessage, ProjectionCopies, ProjectionCopyToMongoDB, ProjectionDeleteResponse, ProjectionEventSelector, ProjectionRegistrationRequest,
    StaticKeySelector as ProtobufStaticKeySelector, EventOccurredKeySelector as ProtobufEventOccurredKeySelector,
    ProjectionRegistrationResponse, ProjectionReplaceResponse, ProjectionRequest,
    ProjectionResponse, ProjectionRuntimeToClientMessage
} from '@dolittle/runtime.contracts/Events.Processing/Projections_pb';
import { ProjectionCurrentStateType } from '@dolittle/runtime.contracts/Projections/State_pb';

import { DeleteReadModelInstance } from '../DeleteReadModelInstance';
import { EventPropertyKeySelector } from '../EventPropertyKeySelector';
import { EventSourceIdKeySelector } from '../EventSourceIdKeySelector';
import { IProjection } from '../IProjection';
import { Key } from '../Key';
import { KeySelector } from '../KeySelector';
import { PartitionIdKeySelector } from '../PartitionIdKeySelector';
import { ProjectionContext } from '../ProjectionContext';
import { ProjectionId } from '../ProjectionId';
import { UnknownKeySelectorType } from '../UnknownKeySelectorType';
import { Conversion } from '../Copies/MongoDB/Conversion';
import { UnknownMongoDBConversion } from '../Copies/MongoDB/UnknownMongoDBConversion';
import { PropertyConversion } from '../Copies/MongoDB/PropertyConversion';
import { StaticKeySelector } from '../StaticKeySelector';
import { EventOccurredKeySelector } from '../EventOccurredKeySelector';

/**
 * Represents an implementation of {@link Internal.EventProcessor} for {@link Projection}.
 * @template T The type of the projection read model.
 */
export class ProjectionProcessor<T> extends Internal.EventProcessor<ProjectionId, ProjectionsClient, ProjectionRegistrationRequest, ProjectionRegistrationResponse, ProjectionRequest, ProjectionResponse> {
    /**
     * Initializes a new instance of {@link ProjectionProcessor}.
     * @param {IProjection<T>} _projection - The projection.
     * @param {IEventTypes} _eventTypes - The registered event types for this projection.
     */
    constructor(
        private _projection: IProjection<T>,
        private _eventTypes: IEventTypes
    ) {
        super('Projection', _projection.projectionId);
    }

    /** @inheritdoc */
    protected get registerArguments(): ProjectionRegistrationRequest {
        const registerArguments = new ProjectionRegistrationRequest();
        registerArguments.setProjectionid(Guids.toProtobuf(this._projection.projectionId.value));
        registerArguments.setScopeid(Guids.toProtobuf(this._projection.scopeId.value));
        registerArguments.setInitialstate(JSON.stringify(this._projection.initialState));
        registerArguments.setCopies(this.createCopiesSpecification());

        const events: ProjectionEventSelector[] = [];
        for (const eventSelector of this._projection.events) {
            const selector = new ProjectionEventSelector();
            selector.setEventtype(Artifacts.toProtobuf(eventSelector.eventType));
            this.setKeySelector(selector, eventSelector.keySelector);
            events.push(selector);
        }
        registerArguments.setEventsList(events);
        return registerArguments;
    }

    private setKeySelector(protobufSelector: ProjectionEventSelector, selector: KeySelector) {
        if (selector instanceof EventPropertyKeySelector) {
            const propertyKeySelector = new ProtobufEventPropertyKeySelector();
            propertyKeySelector.setPropertyname(selector.propertyName.value);
            protobufSelector.setEventpropertykeyselector(propertyKeySelector);
        } else if (selector instanceof EventSourceIdKeySelector) {
            protobufSelector.setEventsourcekeyselector(new ProtobufEventSourceIdKeySelector());
        } else if (selector instanceof PartitionIdKeySelector) {
            protobufSelector.setPartitionkeyselector(new ProtobufPartitionIdKeySelector());
        } else if (selector instanceof StaticKeySelector) {
            const staticKeySelector = new ProtobufStaticKeySelector();
            staticKeySelector.setStatickey(selector.staticKey.value);
            protobufSelector.setStatickeyselector(staticKeySelector);
        } else if (selector instanceof EventOccurredKeySelector) {
            const eventOccurredKeySelector = new ProtobufEventOccurredKeySelector();
            eventOccurredKeySelector.setFormat(selector.occurredFormat.value);
            protobufSelector.setEventoccurredkeyselector(eventOccurredKeySelector);
        } else {
            throw new UnknownKeySelectorType(selector);
        }
    }

    private createCopiesSpecification(): ProjectionCopies {
        const copies = new ProjectionCopies();

        if (this._projection.copies.mongoDB.shouldCopyToMongoDB) {
            const mongoDB = new ProjectionCopyToMongoDB();
            mongoDB.setCollection(this._projection.copies.mongoDB.collectionName.value);
            mongoDB.setConversionsList(this.createMongoDBPropertyConversions(this._projection.copies.mongoDB.conversions));
            copies.setMongodb(mongoDB);
        }

        return copies;
    }

    private createMongoDBPropertyConversions(conversions: PropertyConversion[]): ProjectionCopyToMongoDB.PropertyConversion[] {
        return conversions.map(conversion => {
            const pbConversion = new ProjectionCopyToMongoDB.PropertyConversion();

            pbConversion.setPropertyname(conversion.property.value);

            const pbConversionType =
                conversion.convertTo === Conversion.None ? ProjectionCopyToMongoDB.BSONType.NONE :
                conversion.convertTo === Conversion.Date ? ProjectionCopyToMongoDB.BSONType.DATEASDATE :
                conversion.convertTo === Conversion.DateAsArray ? ProjectionCopyToMongoDB.BSONType.DATEASARRAY :
                conversion.convertTo === Conversion.DateAsDocument ? ProjectionCopyToMongoDB.BSONType.DATEASDOCUMENT :
                conversion.convertTo === Conversion.DateAsString ? ProjectionCopyToMongoDB.BSONType.DATEASSTRING :
                conversion.convertTo === Conversion.DateAsInt64 ? ProjectionCopyToMongoDB.BSONType.DATEASINT64 :
                conversion.convertTo === Conversion.Guid ? ProjectionCopyToMongoDB.BSONType.GUIDASSTANDARDBINARY :
                conversion.convertTo === Conversion.GuidAsCSharpLegacy ? ProjectionCopyToMongoDB.BSONType.GUIDASCSHARPLEGACYBINARY :
                conversion.convertTo === Conversion.GuidAsString ? ProjectionCopyToMongoDB.BSONType.GUIDASSTRING :
                undefined;
            if (pbConversionType === undefined) {
                throw new UnknownMongoDBConversion(conversion.convertTo);
            }
            pbConversion.setConvertto(pbConversionType);

            if (conversion.shouldRename) {
                const renameTo = new StringValue();
                renameTo.setValue(conversion.renameTo.value);
                pbConversion.setRenameto(renameTo);
            }

            pbConversion.setChildrenList(this.createMongoDBPropertyConversions(conversion.children));
            return pbConversion;
        });
    }

    /** @inheritdoc */
    protected createClient(
        client: ProjectionsClient,
        registerArguments: ProjectionRegistrationRequest,
        callback: (request: ProjectionRequest, executionContext: ExecutionContext) => Promise<ProjectionResponse>,
        executionContext: ExecutionContext,
        pingInterval: number,
        logger: Logger,
        cancellation: Cancellation): IReverseCallClient<ProjectionRegistrationResponse> {
        return new ReverseCallClient<ProjectionClientToRuntimeMessage, ProjectionRuntimeToClientMessage, ProjectionRegistrationRequest, ProjectionRegistrationResponse, ProjectionRequest, ProjectionResponse> (
            (requests, cancellation) => reactiveDuplex(client, client.connect, requests, cancellation),
            ProjectionClientToRuntimeMessage,
            (message, connectArguments) => message.setRegistrationrequest(connectArguments),
            (message) => message.getRegistrationresponse(),
            (message) => message.getHandlerequest(),
            (message, response) => message.setHandleresult(response),
            (connectArguments, context) => connectArguments.setCallcontext(context),
            (request) => request.getCallcontext(),
            (response, context) => response.setCallcontext(context),
            (message) => message.getPing(),
            (message, pong) => message.setPong(pong),
            executionContext,
            registerArguments,
            pingInterval,
            callback,
            cancellation,
            logger
        );
    }

    /** @inheritdoc */
    protected getFailureFromRegisterResponse(response: ProjectionRegistrationResponse): Failure | undefined {
        return response.getFailure();
    }

    /** @inheritdoc */
    protected getRetryProcessingStateFromRequest(request: ProjectionRequest): RetryProcessingState | undefined {
        return request.getRetryprocessingstate();
    }

    /** @inheritdoc */
    protected createResponseFromFailure(failure: ProcessorFailure): ProjectionResponse {
        const response = new ProjectionResponse();
        response.setFailure(failure);
        return response;
    }

    /** @inheritdoc */
    protected async handle(request: ProjectionRequest, executionContext: ExecutionContext, services: IServiceProvider, logger: Logger): Promise<ProjectionResponse> {
        if (!request.getEvent() || !request.getEvent()?.getEvent()) {
            throw new MissingEventInformation('No event in ProjectionRequest');
        }

        const pbEvent = request.getEvent()!.getEvent()!;

        const pbSequenceNumber = pbEvent.getEventlogsequencenumber();
        if (pbSequenceNumber === undefined) throw new MissingEventInformation('Sequence Number');

        const pbEventSourceId = pbEvent.getEventsourceid();
        if (!pbEventSourceId) throw new MissingEventInformation('EventSourceId');

        const pbExecutionContext = pbEvent.getExecutioncontext();
        if (!pbExecutionContext) throw new MissingEventInformation('Execution context');

        const pbOccurred = pbEvent.getOccurred();
        if (!pbOccurred) throw new MissingEventInformation('Occurred');

        const pbEventType = pbEvent.getEventtype();
        if (!pbEventType) throw new MissingEventInformation('Event Type');

        const eventContext = new EventContext(
            pbSequenceNumber,
            EventSourceId.from(pbEventSourceId),
            DateTime.fromJSDate(pbOccurred.toDate()),
            ExecutionContexts.toSDK(pbExecutionContext),
            executionContext);

        if (!request.getCurrentstate() || !request.getCurrentstate()?.getState()) {
            throw new MissingEventInformation('No state in ProjectionRequest');
        }

        const pbCurrentState = request.getCurrentstate()!;
        const pbStateType = pbCurrentState.getType();
        const pbKey = pbCurrentState.getKey();

        const projectionContext = new ProjectionContext(
            pbStateType === ProjectionCurrentStateType.CREATED_FROM_INITIAL_STATE,
            Key.from(pbKey),
            eventContext);

        let event = JSON.parse(pbEvent.getContent());

        const eventType = Artifacts.toSDK(pbEventType, EventType.from);
        if (this._eventTypes.hasTypeFor(eventType)) {
            const typeOfEvent = this._eventTypes.getTypeFor(eventType);
            event = Object.assign(new typeOfEvent(), event);
        }

        let state = JSON.parse(request.getCurrentstate()!.getState());
        if (this._projection.readModelType !== undefined) {
            state = Object.assign(new this._projection.readModelType(), state);
        }

        const nextStateOrDelete = await this._projection.on(state, event, eventType, projectionContext);
        const response = new ProjectionResponse();

        if (nextStateOrDelete instanceof DeleteReadModelInstance) {
            response.setDelete(new ProjectionDeleteResponse());
        } else {
            const replace = new ProjectionReplaceResponse();
            replace.setState(JSON.stringify(nextStateOrDelete));
            response.setReplace(replace);
        }

        return response;
    }
}

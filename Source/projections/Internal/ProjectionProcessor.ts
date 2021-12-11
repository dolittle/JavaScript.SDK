// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { DateTime } from 'luxon';
import { Logger } from 'winston';
import { Constructor } from '@dolittle/types';

import { IServiceProvider } from '@dolittle/sdk.common';
import { EventContext, EventSourceId, EventType, IEventTypes } from '@dolittle/sdk.events';
import { Internal, MissingEventInformation } from '@dolittle/sdk.events.processing';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { Cancellation } from '@dolittle/sdk.resilience';
import { IReverseCallClient, reactiveDuplex, ReverseCallClient } from '@dolittle/sdk.services';

import { Failure } from '@dolittle/contracts/Protobuf/Failure_pb';
import { ProcessorFailure, RetryProcessingState } from '@dolittle/runtime.contracts/Events.Processing/Processors_pb';
import { ProjectionsClient } from '@dolittle/runtime.contracts/Events.Processing/Projections_grpc_pb';
import {
    EventPropertyKeySelector as ProtobufEventPropertyKeySelector, EventSourceIdKeySelector as ProtobufEventSourceIdKeySelector, PartitionIdKeySelector as ProtobufPartitionIdKeySelector, ProjectionClientToRuntimeMessage, ProjectionDeleteResponse, ProjectionEventSelector, ProjectionRegistrationRequest,
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

import '@dolittle/sdk.protobuf';

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
        registerArguments.setProjectionid(this._projection.projectionId.value.toProtobuf());
        registerArguments.setScopeid(this._projection.scopeId.value.toProtobuf());

        let readModelInstance;
        if (typeof this._projection.readModelTypeOrInstance === 'function') {
            const constructor = this._projection.readModelTypeOrInstance as Constructor<T>;
            readModelInstance = new constructor();
        } else {
            readModelInstance = this._projection.readModelTypeOrInstance;
        }
        registerArguments.setInitialstate(JSON.stringify(readModelInstance));

        const events: ProjectionEventSelector[] = [];
        for (const eventSelector of this._projection.events) {
            const selector = new ProjectionEventSelector();
            selector.setEventtype(eventSelector.eventType.toProtobuf());
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
        } else {
            throw new UnknownKeySelectorType(selector);
        }
    }

    /** @inheritdoc */
    protected createClient(
        client: ProjectionsClient,
        registerArguments: ProjectionRegistrationRequest,
        callback: (request: ProjectionRequest, executionContext: ExecutionContext) => Promise<ProjectionResponse>,
        executionContext: ExecutionContext,
        pingTimeout: number,
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
            pingTimeout,
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

        const eventType = pbEventType.toSDK(EventType.from);
        if (this._eventTypes.hasTypeFor(eventType)) {
            const typeOfEvent = this._eventTypes.getTypeFor(eventType);
            event = Object.assign(new typeOfEvent(), event);
        }

        let state = JSON.parse(request.getCurrentstate()!.getState());
        if (typeof this._projection.readModelTypeOrInstance === 'function') {
            state = Object.assign(new (this._projection.readModelTypeOrInstance as Constructor<T>)(), state);
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

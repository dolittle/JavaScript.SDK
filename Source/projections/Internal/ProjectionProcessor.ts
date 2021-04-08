// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';
import { DateTime } from 'luxon';

import { MissingEventInformation } from '@dolittle/sdk.events.processing';
import { EventProcessor } from '@dolittle/sdk.events.processing/Internal';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { Constructor } from '@dolittle/types';
import { Cancellation } from '@dolittle/sdk.resilience';
import { IReverseCallClient, reactiveDuplex, ReverseCallClient } from '@dolittle/sdk.services';
import { EventContext, EventSourceId, IEventTypes } from '@dolittle/sdk.events';
import { eventTypes, guids } from '@dolittle/sdk.protobuf';

import {
    ProjectionRegistrationRequest,
    ProjectionRegistrationResponse,
    ProjectionClientToRuntimeMessage,
    ProjectionRuntimeToClientMessage,
    ProjectionRequest,
    ProjectionResponse,
    ProjectionEventSelector,
    EventPropertyKeySelector as ProtobufEventPropertyKeySelector,
    PartitionIdKeySelector as ProtobufPartitionIdKeySelector,
    EventSourceIdKeySelector as ProtobufEventSourceIdKeySelector,
    ProjectionDeleteResponse,
    ProjectionReplaceResponse
} from '@dolittle/runtime.contracts/Events.Processing/Projections_pb';
import { ProjectionsClient } from '@dolittle/runtime.contracts/Events.Processing/Projections_grpc_pb';
import { Failure } from '@dolittle/contracts/Protobuf/Failure_pb';
import { RetryProcessingState, ProcessorFailure } from '@dolittle/runtime.contracts/Events.Processing/Processors_pb';

import {
    DeleteReadModelInstance,
    EventPropertyKeySelector,
    EventSourceIdKeySelector,
    IProjection,
    Key,
    KeySelector,
    PartitionIdKeySelector,
    ProjectionId,
    ProjectionContext,
    UnknownKeySelectorType,
} from '..';
import { ProjectionCurrentStateType } from '@dolittle/runtime.contracts/Projections/State_pb';


/**
 * Represents an implementation of {@link EventProcessor} for {@link Projection}.
 */
export class ProjectionProcessor<T> extends EventProcessor<ProjectionId, ProjectionRegistrationRequest, ProjectionRegistrationResponse, ProjectionRequest, ProjectionResponse> {

    /**
     * Initializes a new instance of {@link ProjectionProcessor}
     * @template T
     * @param {IProjection<T>} _projection The projection
     * @param {ProjectionsClient} _client The client used to connect to the Runtime
     * @param {ExecutionContext} _executionContext The execution context
     * @param {IEventType} _eventTypes The registered event types for this projection
     * @param {ILogger} logger Logger for logging
     */
    constructor(
        private _projection: IProjection<T>,
        private _client: ProjectionsClient,
        private _executionContext: ExecutionContext,
        private _eventTypes: IEventTypes,
        logger: Logger
    ) {
        super('Projection', _projection.projectionId, logger);
    }

    protected get registerArguments(): ProjectionRegistrationRequest {
        const registerArguments = new ProjectionRegistrationRequest();
        registerArguments.setProjectionid(guids.toProtobuf(this._projection.projectionId.value));
        registerArguments.setScopeid(guids.toProtobuf(this._projection.scopeId.value));


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
            selector.setEventtype(eventTypes.toProtobuf(eventSelector.eventType));
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
        }
        throw new UnknownKeySelectorType(selector);
    }

    protected createClient(
        registerArguments: ProjectionRegistrationRequest,
        callback: (request: ProjectionRequest, executionContext: ExecutionContext) => Promise<ProjectionResponse>,
        pingTimeout: number,
        cancellation: Cancellation): IReverseCallClient<ProjectionRegistrationResponse> {
        return new ReverseCallClient<ProjectionClientToRuntimeMessage, ProjectionRuntimeToClientMessage, ProjectionRegistrationRequest, ProjectionRegistrationResponse, ProjectionRequest, ProjectionResponse> (
            (requests, cancellation) => reactiveDuplex(this._client, this._client.connect, requests, cancellation),
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
            this._executionContext,
            registerArguments,
            pingTimeout,
            callback,
            cancellation,
            this._logger
        );
    }

    protected getFailureFromRegisterResponse(response: ProjectionRegistrationResponse): Failure | undefined {
        return response.getFailure();
    }

    protected getRetryProcessingStateFromRequest(request: ProjectionRequest): RetryProcessingState | undefined {
        return request.getRetryprocessingstate();
    }

    protected createResponseFromFailure(failure: ProcessorFailure): ProjectionResponse {
        const response = new ProjectionResponse();
        response.setFailure(failure);
        return response;
    }

    protected async handle(request: ProjectionRequest, executionContext: ExecutionContext): Promise<ProjectionResponse> {
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

        const pbArtifact = pbEvent.getType();
        if (!pbArtifact) throw new MissingEventInformation('Artifact');

        const eventContext = new EventContext(
            pbSequenceNumber,
            EventSourceId.from(guids.toSDK(pbEventSourceId)),
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

        const eventType = eventTypes.toSDK(pbArtifact);
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

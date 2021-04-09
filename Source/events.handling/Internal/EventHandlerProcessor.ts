// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';
import { DateTime } from 'luxon';

import { EventContext, IEventTypes, EventSourceId } from '@dolittle/sdk.events';
import { MissingEventInformation, internal } from '@dolittle/sdk.events.processing';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { Cancellation } from '@dolittle/sdk.resilience';
import { IReverseCallClient, ReverseCallClient, reactiveDuplex } from '@dolittle/sdk.services';

import {
    EventHandlerRegistrationRequest,
    EventHandlerRegistrationResponse,
    EventHandlerClientToRuntimeMessage,
    EventHandlerRuntimeToClientMessage,
    HandleEventRequest,
    EventHandlerResponse
} from '@dolittle/runtime.contracts/Events.Processing/EventHandlers_pb';
import { Artifact } from '@dolittle/contracts/Artifacts/Artifact_pb';
import { Failure } from '@dolittle/contracts/Protobuf/Failure_pb';
import { EventHandlersClient } from '@dolittle/runtime.contracts/Events.Processing/EventHandlers_grpc_pb';
import { RetryProcessingState, ProcessorFailure } from '@dolittle/runtime.contracts/Events.Processing/Processors_pb';

import { guids, eventTypes } from '@dolittle/sdk.protobuf';

import { EventHandlerId, IEventHandler } from '..';

/**
 * Represents an implementation of {@link EventProcessor} for {@link EventHandler}.
 */
export class EventHandlerProcessor extends internal.EventProcessor<EventHandlerId, EventHandlerRegistrationRequest, EventHandlerRegistrationResponse, HandleEventRequest, EventHandlerResponse> {

    /**
     * Initializes a new instance of {@link EventHandlerProcessor}
     * @param {IEventHandler} _handler The actual handler.
     * @param {EventHandlersClient} _client Client to use for connecting to the runtime.
     * @param {EventHandlersClient} _executionContext Execution context.
     * @param {IEventTypes} _eventTypes Registered event types.
     * @param {ILogger} logger Logger for logging.
     */
    constructor(
        private _handler: IEventHandler,
        private _client: EventHandlersClient,
        private _executionContext: ExecutionContext,
        private _eventTypes: IEventTypes,
        logger: Logger
    ) {
        super('EventHandler', _handler.eventHandlerId, logger);
    }

    protected get registerArguments(): EventHandlerRegistrationRequest {
        const registerArguments = new EventHandlerRegistrationRequest();
        registerArguments.setEventhandlerid(guids.toProtobuf(this._identifier.value));
        registerArguments.setScopeid(guids.toProtobuf(this._handler.scopeId.value));
        registerArguments.setPartitioned(this._handler.partitioned);

        const handledArtifacts: Artifact[] = [];
        for (const eventType of this._handler.handledEvents) {
            handledArtifacts.push(eventTypes.toProtobuf(eventType));
        }
        registerArguments.setTypesList(handledArtifacts);
        return registerArguments;
    }

    protected createClient(
        registerArguments: EventHandlerRegistrationRequest,
        callback: (request: HandleEventRequest, executionContext: ExecutionContext) => Promise<EventHandlerResponse>,
        pingTimeout: number,
        cancellation: Cancellation): IReverseCallClient<EventHandlerRegistrationResponse> {
        return new ReverseCallClient<EventHandlerClientToRuntimeMessage, EventHandlerRuntimeToClientMessage, EventHandlerRegistrationRequest, EventHandlerRegistrationResponse, HandleEventRequest, EventHandlerResponse> (
            (requests, cancellation) => reactiveDuplex(this._client, this._client.connect, requests, cancellation),
            EventHandlerClientToRuntimeMessage,
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

    protected getFailureFromRegisterResponse(response: EventHandlerRegistrationResponse): Failure | undefined {
        return response.getFailure();
    }

    protected getRetryProcessingStateFromRequest(request: HandleEventRequest): RetryProcessingState | undefined {
        return request.getRetryprocessingstate();
    }

    protected createResponseFromFailure(failure: ProcessorFailure): EventHandlerResponse {
        const response = new EventHandlerResponse();
        response.setFailure(failure);
        return response;
    }

    protected async handle(request: HandleEventRequest, executionContext: ExecutionContext): Promise<EventHandlerResponse> {
        if (!request.getEvent() || !request.getEvent()?.getEvent()) {
            throw new MissingEventInformation('no event in HandleEventRequest');
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

        let event = JSON.parse(pbEvent.getContent());

        const eventType = eventTypes.toSDK(pbArtifact);
        if (this._eventTypes.hasTypeFor(eventType)) {
            const typeOfEvent = this._eventTypes.getTypeFor(eventType);
            event = Object.assign(new typeOfEvent(), event);
        }

        await this._handler.handle(event, eventType, eventContext);

        return new EventHandlerResponse();
    }
}

// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';
import { DateTime } from 'luxon';

import { IServiceProvider } from '@dolittle/sdk.dependencyinversion';
import { EventContext, IEventTypes, EventSourceId, EventType } from '@dolittle/sdk.events';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { Internal, MissingEventInformation } from '@dolittle/sdk.events.processing';
import { Artifacts, ExecutionContexts, Guids } from '@dolittle/sdk.protobuf';
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

import { EventHandlerId } from '../EventHandlerId';
import { IEventHandler } from '../IEventHandler';

/**
 * Represents an implementation of {@link Internal.EventProcessor} for {@link EventHandler}.
 */
export class EventHandlerProcessor extends Internal.EventProcessor<EventHandlerId, EventHandlersClient, EventHandlerRegistrationRequest, EventHandlerRegistrationResponse, HandleEventRequest, EventHandlerResponse> {

    /**
     * Initializes a new instance of {@link EventHandlerProcessor}.
     * @param {IEventHandler} _handler - The actual handler.
     * @param {IEventTypes} _eventTypes - Registered event types.
     */
    constructor(
        private _handler: IEventHandler,
        private _eventTypes: IEventTypes
    ) {
        super('EventHandler', _handler.eventHandlerId);
    }

    /** @inheritdoc */
    protected get registerArguments(): EventHandlerRegistrationRequest {
        const registerArguments = new EventHandlerRegistrationRequest();
        registerArguments.setEventhandlerid(Guids.toProtobuf(this._identifier.value));
        registerArguments.setScopeid(Guids.toProtobuf(this._handler.scopeId.value));
        registerArguments.setPartitioned(this._handler.partitioned);
        if (this._handler.hasAlias) {
            registerArguments.setAlias(this._handler.alias!.value);
        }
        const handledArtifacts: Artifact[] = [];
        for (const eventType of this._handler.handledEvents) {
            handledArtifacts.push(Artifacts.toProtobuf(eventType));
        }
        registerArguments.setEventtypesList(handledArtifacts);
        return registerArguments;
    }

    /** @inheritdoc */
    protected createClient(
        client: EventHandlersClient,
        registerArguments: EventHandlerRegistrationRequest,
        callback: (request: HandleEventRequest, executionContext: ExecutionContext) => Promise<EventHandlerResponse>,
        executionContext: ExecutionContext,
        pingInterval: number,
        logger: Logger,
        cancellation: Cancellation): IReverseCallClient<EventHandlerRegistrationResponse> {
        return new ReverseCallClient<EventHandlerClientToRuntimeMessage, EventHandlerRuntimeToClientMessage, EventHandlerRegistrationRequest, EventHandlerRegistrationResponse, HandleEventRequest, EventHandlerResponse> (
            (requests, cancellation) => reactiveDuplex(client, client.connect, requests, cancellation),
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
            executionContext,
            registerArguments,
            pingInterval,
            callback,
            cancellation,
            logger
        );
    }

    /** @inheritdoc */
    protected getFailureFromRegisterResponse(response: EventHandlerRegistrationResponse): Failure | undefined {
        return response.getFailure();
    }

    /** @inheritdoc */
    protected getRetryProcessingStateFromRequest(request: HandleEventRequest): RetryProcessingState | undefined {
        return request.getRetryprocessingstate();
    }

    /** @inheritdoc */
    protected createResponseFromFailure(failure: ProcessorFailure): EventHandlerResponse {
        const response = new EventHandlerResponse();
        response.setFailure(failure);
        return response;
    }

    /** @inheritdoc */
    protected async handle(request: HandleEventRequest, executionContext: ExecutionContext, services: IServiceProvider, logger: Logger): Promise<EventHandlerResponse> {
        if (!request.getEvent() || !request.getEvent()?.getEvent()) {
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

        const pbEventType = pbEvent.getEventtype();
        if (!pbEventType) throw new MissingEventInformation('Event Type');

        const eventContext = new EventContext(
            pbSequenceNumber,
            EventSourceId.from(pbEventSourceId),
            DateTime.fromJSDate(pbOccurred.toDate()),
            ExecutionContexts.toSDK(pbExecutionContext),
            executionContext);

        let event = JSON.parse(pbEvent.getContent());

        const eventType = Artifacts.toSDK(pbEventType, EventType.from);
        if (this._eventTypes.hasTypeFor(eventType)) {
            const typeOfEvent = this._eventTypes.getTypeFor(eventType);
            event = Object.assign(new typeOfEvent(), event);
        }

        await this._handler.handle(event, eventType, eventContext, services, logger);

        return new EventHandlerResponse();
    }
}

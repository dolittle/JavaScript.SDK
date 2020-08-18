// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';
import { DateTime } from 'luxon';

import { Guid } from '@dolittle/rudiments';
import { IArtifacts } from '@dolittle/sdk.artifacts';
import { EventContext, ScopeId } from '@dolittle/sdk.events';
import { EventProcessor } from '@dolittle/sdk.events.processing';
import { IExecutionContextManager } from '@dolittle/sdk.execution';
import { Cancellation } from '@dolittle/sdk.resilience';
import { IReverseCallClient, ReverseCallClient, reactiveDuplex } from '@dolittle/sdk.services';

import {
    EventHandlerRegistrationRequest,
    EventHandlerRegistrationResponse,
    EventHandlerClientToRuntimeMessage,
    EventHandlerRuntimeToClientMessage,
    HandleEventRequest,
    EventHandlerResponse
} from '@dolittle/runtime.contracts/Runtime/Events.Processing/EventHandlers_pb';
import { Artifact } from '@dolittle/runtime.contracts/Fundamentals/Artifacts/Artifact_pb';
import { Failure } from '@dolittle/runtime.contracts/Fundamentals/Protobuf/Failure_pb';
import { EventHandlersClient } from '@dolittle/runtime.contracts/Runtime/Events.Processing/EventHandlers_grpc_pb';
import { RetryProcessingState, ProcessorFailure } from '@dolittle/runtime.contracts/Runtime/Events.Processing/Processors_pb';

import { guids, artifacts, executionContexts } from '@dolittle/sdk.protobuf';

import { EventHandlerId } from '../EventHandlerId';
import { IEventHandler } from '../IEventHandler';
import { MissingEventInformation } from '../MissingEventInformation';

/**
 * Represents an implementation of {@link EventProcessor} for {@link EventHandler}.
 */
export class EventHandlerProcessor extends EventProcessor<EventHandlerId, EventHandlerRegistrationRequest, EventHandlerRegistrationResponse, HandleEventRequest, EventHandlerResponse> {

    /**
     * Initializes a new instance of {@link EventHandlerProcessor}
     * @param {EventHandlerId} eventHandlerId The unique identifier for the event handler.
     * @param {ScopeId} _scope The scope the event handler is for.
     * @param {boolean} _partitioned Whether or not the handler is partitioned.
     * @param {IEventHandler} _handler The actual handler.
     * @param {EventHandlersClient} _client Client to use for connecting to the runtime.
     * @param {IExecutionContextManager} _executionContextManager For managing execution contexts.
     * @param {IArtifacts} _artifacts Registered Artifacts.
     * @param {ILogger} logger Logger for logging.
     */
    constructor(
        eventHandlerId: EventHandlerId,
        private _scope: ScopeId,
        private _partitioned: boolean,
        private _handler: IEventHandler,
        private _client: EventHandlersClient,
        private _executionContextManager: IExecutionContextManager,
        private _artifacts: IArtifacts,
        logger: Logger
    ) {
        super('EventHandler', eventHandlerId, logger);
    }

    protected get registerArguments(): EventHandlerRegistrationRequest {
        const registerArguments = new EventHandlerRegistrationRequest();
        registerArguments.setEventhandlerid(guids.toProtobuf(Guid.as(this._identifier)));
        registerArguments.setScopeid(guids.toProtobuf(Guid.as(this._scope)));
        registerArguments.setPartitioned(this._partitioned);

        const handledArtifacts: Artifact[] = [];
        for (const artifact of this._handler.handledEvents) {
            handledArtifacts.push(artifacts.toProtobuf(artifact));
        }
        registerArguments.setTypesList(handledArtifacts);
        return registerArguments;
    }

    protected createClient(registerArguments: EventHandlerRegistrationRequest, callback: (request: HandleEventRequest) => Promise<EventHandlerResponse>, pingTimeout: number, cancellation: Cancellation): IReverseCallClient<EventHandlerRegistrationResponse> {
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
            this._executionContextManager,
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

    protected async handle(request: HandleEventRequest): Promise<EventHandlerResponse> {
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
            guids.toSDK(pbEventSourceId),
            DateTime.fromJSDate(pbOccurred.toDate()),
            executionContexts.toSDK(pbExecutionContext)
        );

        let event = JSON.parse(pbEvent.getContent());

        const artifact = artifacts.toSDK(pbArtifact);
        if (this._artifacts.hasTypeFor(artifact)) {
            const eventType = this._artifacts.getTypeFor(artifact);
            event = Object.assign(new eventType(), event);
        }

        await this._handler.handle(event, artifact, eventContext);

        return new EventHandlerResponse();
    }
}


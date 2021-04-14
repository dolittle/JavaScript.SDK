// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';
import { DateTime } from 'luxon';
const crypto = require('crypto');

import { EventConverters } from '@dolittle/sdk.events';
import { MissingEventInformation, internal } from '@dolittle/sdk.events.processing';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { Constructor } from '@dolittle/types';
import { Cancellation } from '@dolittle/sdk.resilience';
import { IReverseCallClient, reactiveDuplex, ReverseCallClient } from '@dolittle/sdk.services';
import { EventContext, EventSourceId, IEventTypes } from '@dolittle/sdk.events';
import { eventTypes, guids } from '@dolittle/sdk.protobuf';
import {
    DeleteReadModelInstance,
    EventPropertyKeySelector,
    EventSourceIdKeySelector,
    PartitionIdKeySelector,
    KeySelector,
    Key,
    UnknownKeySelectorType
} from '@dolittle/sdk.projections';

import {
    EmbeddingRegistrationRequest,
    EmbeddingRegistrationResponse,
    EmbeddingClientToRuntimeMessage,
    EmbeddingRuntimeToClientMessage,
    EmbeddingRequest,
    EmbeddingResponse,
    EmbeddingDeleteRequest,
    EmbeddingCompareRequest
} from '@dolittle/runtime.contracts/Embeddings/Embeddings_pb';

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

import { EmbeddingsClient } from '@dolittle/runtime.contracts/Embeddings/Embeddings_grpc_pb';
import { Failure } from '@dolittle/contracts/Protobuf/Failure_pb';
import { RetryProcessingState, ProcessorFailure } from '@dolittle/runtime.contracts/Events.Processing/Processors_pb';
import { ProjectionCurrentStateType } from '@dolittle/runtime.contracts/Projections/State_pb';

import {
    IEmbedding,
    EmbeddingId,
    EmbeddingContext,
    UnknownEmbeddingRequestCase
} from '..';
import { MissingEmbeddingInformation } from '../MissingEmbeddingInformation';
import { Guid } from '@dolittle/rudiments';


/**
 * Represents an implementation of {@link EventProcessor} for {@link Embedding}.
 */
export class EmbeddingProcessor<T> extends internal.EventProcessor<EmbeddingId, EmbeddingRegistrationRequest, EmbeddingRegistrationResponse, EmbeddingRequest, EmbeddingResponse> {

    /**
     * Initializes a new instance of {@link EmbeddingProcessor}
     * @template T
     * @param {IEmbedding<T>} _embedding The embedding
     * @param {EmbeddingsClient} _client The client used to connect to the Runtime
     * @param {ExecutionContext} _executionContext The execution context
     * @param {IEventType} _eventTypes The registered event types for this embedding
     * @param {ILogger} logger Logger for logging
     */
    constructor(
        private _embedding: IEmbedding<T>,
        private _client: EmbeddingsClient,
        private _executionContext: ExecutionContext,
        private _eventTypes: IEventTypes,
        logger: Logger
    ) {
        super('Embedding', _embedding.embeddingId, logger);
    }

    protected get registerArguments(): EmbeddingRegistrationRequest {
        const registerArguments = new EmbeddingRegistrationRequest();
        registerArguments.setEmbeddingid(guids.toProtobuf(this._embedding.embeddingId.value));

        let readModelInstance;
        if (typeof this._embedding.readModelTypeOrInstance === 'function') {
            const constructor = this._embedding.readModelTypeOrInstance as Constructor<T>;
            readModelInstance = new constructor();
        } else {
            readModelInstance = this._embedding.readModelTypeOrInstance;
        }
        registerArguments.setInitialstate(JSON.stringify(readModelInstance));

        const events: ProjectionEventSelector[] = [];
        for (const eventSelector of this._embedding.events) {
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
        } else {
            throw new UnknownKeySelectorType(selector);
        }
    }

    protected createClient(
        registerArguments: EmbeddingRegistrationRequest,
        callback: (request: EmbeddingRequest, executionContext: ExecutionContext) => Promise<EmbeddingResponse>,
        pingTimeout: number,
        cancellation: Cancellation): IReverseCallClient<EmbeddingRegistrationResponse> {
        return new ReverseCallClient<EmbeddingClientToRuntimeMessage, EmbeddingRuntimeToClientMessage, EmbeddingRegistrationRequest, EmbeddingRegistrationResponse, EmbeddingRequest, EmbeddingResponse> (
            (requests, cancellation) => reactiveDuplex(this._client, this._client.connect, requests, cancellation),
            EmbeddingClientToRuntimeMessage,
            (message, connectArguments) => message.setRegistrationrequest(connectArguments),
            (message) => message.getRegistrationresponse(),
            (message) => message.getHandleembeddingrequest(),
            (message, response) => message.setHandleembeddingresult(response),
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

    protected getFailureFromRegisterResponse(response: EmbeddingRegistrationResponse): Failure | undefined {
        return response.getFailure();
    }

    protected getRetryProcessingStateFromRequest(request: EmbeddingRequest): RetryProcessingState | undefined {
        return request.getRetryprocessingstate();
    }

    protected createResponseFromFailure(failure: ProcessorFailure): EmbeddingResponse {
        const response = new EmbeddingResponse();
        response.setFailure(failure);
        return response;
    }

    protected async handle(request: EmbeddingRequest, executionContext: ExecutionContext): Promise<EmbeddingResponse> { const pbRequestCase = request.getRequestCase();
        switch (pbRequestCase) {
            case EmbeddingRequest.RequestCase.COMPARE:
                return this.handleCompare(request, executionContext);
            case EmbeddingRequest.RequestCase.DELETE:
                return this.handleDelete(request, executionContext);
            case EmbeddingRequest.RequestCase.REQUEST_NOT_SET:
            default:
                throw new UnknownEmbeddingRequestCase(pbRequestCase);
        }
    }

    private async handleCompare(request: EmbeddingRequest, executionContext: ExecutionContext): Promise<EmbeddingResponse> {
        if (!request.hasCompare()) {
            throw new MissingEmbeddingInformation('No compare request in EmbeddingRequest');
        }
        const compareRequest = request.getCompare()!;

        if (!compareRequest.hasProjectionstate()) {
            throw new MissingEmbeddingInformation('No projection state in EmbeddingRequest');
        }
        const projectionCurrentState = compareRequest.getProjectionstate()!;
        const projectionStateType = projectionCurrentState.getType();
        const projectionStateKey = projectionCurrentState.getKey();
        const embeddingContext = new EmbeddingContext(
            projectionStateType === ProjectionCurrentStateType.CREATED_FROM_INITIAL_STATE,
            Key.from(projectionStateKey),
            false);


        let state = JSON.parse(projectionCurrentState.getState());
        let entityState = JSON.parse(compareRequest.getEntitystate());
        if (typeof this._embedding.readModelTypeOrInstance === 'function') {
            state = Object.assign(new (this._embedding.readModelTypeOrInstance as Constructor<T>)(), state);
            entityState = Object.assign(new (this._embedding.readModelTypeOrInstance as Constructor<T>)(), entityState);
        } else {
            const instanceConstructor = Object.getPrototypeOf(this._embedding.readModelTypeOrInstance).constructor as Constructor<T>;
            state = Object.assign(new (instanceConstructor)(), state);
            entityState = Object.assign(new (instanceConstructor)(), entityState);
        }

        const compareEvents = [...await this._embedding.compare(entityState, state, embeddingContext)];

        const eventSourceId = this.createHashedEventSourceId(this._embedding.embeddingId, projectionStateKey);
        const response = new EmbeddingResponse();

        response.setEventsList(compareEvents
            .map(sdkEvent => EventConverters.getUncommittedEventFrom(
                    sdkEvent,
                    eventSourceId,
                    this._eventTypes.resolveFrom(sdkEvent),
                    true)));

        return response;
    }

    private createHashedEventSourceId(embeddingId: EmbeddingId, key: string) {
        const eventSourceHash = crypto.createHash('sha256');
        eventSourceHash.update(embeddingId.value.bytes);
        eventSourceHash.update(key, 'utf-8');
        return EventSourceId.from(new Guid(eventSourceHash.digest()));
    }
}

// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Artifact } from '@dolittle/contracts/Artifacts/Artifact_pb';
import { Failure } from '@dolittle/contracts/Protobuf/Failure_pb';
import { EmbeddingsClient } from '@dolittle/runtime.contracts/Embeddings/Embeddings_grpc_pb';
import {
    EmbeddingClientToRuntimeMessage,
    EmbeddingCompareRequest,
    EmbeddingCompareResponse,
    EmbeddingDeleteResponse,
    EmbeddingProjectRequest,
    EmbeddingRegistrationRequest,
    EmbeddingRegistrationResponse,
    EmbeddingRequest,
    EmbeddingResponse,
    EmbeddingRuntimeToClientMessage,
} from '@dolittle/runtime.contracts/Embeddings/Embeddings_pb';
import { ProjectionDeleteResponse, ProjectionReplaceResponse } from '@dolittle/runtime.contracts/Events.Processing/Projections_pb';
import { ProjectionCurrentState, ProjectionCurrentStateType } from '@dolittle/runtime.contracts/Projections/State_pb';
import { EventConverters, EventSourceId, EventType, IEventTypes } from '@dolittle/sdk.events';
import { MissingEventInformation } from '@dolittle/sdk.events.processing';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { DeleteReadModelInstance, Key} from '@dolittle/sdk.projections';
import { artifacts, failures, guids } from '@dolittle/sdk.protobuf';
import { Cancellation } from '@dolittle/sdk.resilience';
import {
    ClientProcessor,
    IReverseCallClient,
    reactiveDuplex,
    ReverseCallClient
} from '@dolittle/sdk.services';
import { Constructor } from '@dolittle/types';
import { Logger } from 'winston';
import {
    EmbeddingContext,
    EmbeddingId,
    EmbeddingProjectContext,
    MissingEmbeddingInformation
} from '..';
import { IEmbedding } from './IEmbedding';

/**
 * Represents an implementation of {@link ClientProcessor} for {@link Embedding}.
 */
export class EmbeddingProcessor<TReadModel> extends ClientProcessor<EmbeddingId, EmbeddingRegistrationRequest, EmbeddingRegistrationResponse, EmbeddingRequest, EmbeddingResponse> {

    /**
     * Initializes a new instance of {@link EmbeddingProcessor}.
     * @template TReadModel
     * @param {IEmbedding<TReadModel>} _embedding - The embedding.
     * @param {EmbeddingsClient} _client - The client used to connect to the Runtime.
     * @param {ExecutionContext} _executionContext - The execution context.
     * @param {IEventType} _eventTypes - The registered event types for this embedding.
     * @param _logger
     * @param {ILogger} logger - Logger for logging.
     */
    constructor(
        private _embedding: IEmbedding<TReadModel>,
        private _client: EmbeddingsClient,
        private _executionContext: ExecutionContext,
        private _eventTypes: IEventTypes,
        protected _logger: Logger
    ) {
        super('Embedding', _embedding.embeddingId, _logger);
    }

    /** @inheritdoc */
    protected get registerArguments(): EmbeddingRegistrationRequest {
        const registerArguments = new EmbeddingRegistrationRequest();
        registerArguments.setEmbeddingid(guids.toProtobuf(this._embedding.embeddingId.value));

        let readModelInstance;
        if (typeof this._embedding.readModelTypeOrInstance === 'function') {
            const constructor = this._embedding.readModelTypeOrInstance as Constructor<TReadModel>;
            readModelInstance = new constructor();
        } else {
            readModelInstance = this._embedding.readModelTypeOrInstance;
        }
        registerArguments.setInitialstate(JSON.stringify(readModelInstance));

        const events: Artifact[] = [];
        for (const eventType of this._embedding.events) {
            events.push(artifacts.toProtobuf(eventType));
        }
        registerArguments.setEventsList(events);
        return registerArguments;
    }

    /** @inheritdoc */
    protected createClient(
        registerArguments: EmbeddingRegistrationRequest,
        callback: (request: EmbeddingRequest, executionContext: ExecutionContext) => Promise<EmbeddingResponse>,
        pingTimeout: number,
        cancellation: Cancellation): IReverseCallClient<EmbeddingRegistrationResponse> {
        return new ReverseCallClient<EmbeddingClientToRuntimeMessage, EmbeddingRuntimeToClientMessage, EmbeddingRegistrationRequest, EmbeddingRegistrationResponse, EmbeddingRequest, EmbeddingResponse>(
            (requests, cancellation) => reactiveDuplex(this._client, this._client.connect, requests, cancellation),
            EmbeddingClientToRuntimeMessage,
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

    /** @inheritdoc */
    protected getFailureFromRegisterResponse(response: EmbeddingRegistrationResponse): Failure | undefined {
        return response.getFailure();
    }

    /** @inheritdoc */
    protected async handle(request: EmbeddingRequest, executionContext: ExecutionContext): Promise<EmbeddingResponse> {
        const projectionCurrentState = this.getProjectionCurrentState(request);
        const projectionType = projectionCurrentState.getType();
        const projectionKey = projectionCurrentState.getKey();
        const projectionInstance = this.createInstanceFromString(projectionCurrentState.getState());
        const embeddingContext = this.createEmbeddingContext(projectionType, projectionKey, request.getRequestCase(), executionContext);

        const response = new EmbeddingResponse();
        switch (request.getRequestCase()) {
            case EmbeddingRequest.RequestCase.COMPARE:
                response.setCompare(await this.createCompareResponse(request.getCompare()!, projectionInstance, embeddingContext));
                break;
            case EmbeddingRequest.RequestCase.DELETE:
                response.setDelete(await this.createDeleteResponse(projectionInstance, embeddingContext));
                break;
            case EmbeddingRequest.RequestCase.PROJECTION:
                const projectionResult = await this.createProjectionResponse(request.getProjection()!, projectionInstance, executionContext);
                if (projectionResult instanceof ProjectionReplaceResponse) {
                    response.setProjectionreplace(projectionResult);
                } else {
                    response.setProjectiondelete(projectionResult);
                }
                break;
        }
        return response;
    }

    /** @inheritdoc */
    protected async catchingHandle(request: EmbeddingRequest, executionContext: ExecutionContext): Promise<EmbeddingResponse> {
        try {
            return await this.handle(request, executionContext);
        } catch (error) {
            return this.createResponseFromError(error);
        }
    }

    private async createCompareResponse(request: EmbeddingCompareRequest, projectionInstance: TReadModel, context: EmbeddingContext): Promise<EmbeddingCompareResponse> {
        const entityState = this.createInstanceFromString(request.getEntitystate());

        const events = this.getUncommittedEvents(await this._embedding.update(entityState, projectionInstance, context));

        const compareResponse = new EmbeddingCompareResponse();
        compareResponse.setEventsList(events);
        return compareResponse;
    }

    private async createDeleteResponse(projectionInstance: TReadModel, context: EmbeddingContext): Promise<EmbeddingDeleteResponse> {
        const events = this.getUncommittedEvents(await this._embedding.delete(projectionInstance, context));

        const deleteResponse = new EmbeddingDeleteResponse();
        deleteResponse.setEventsList(events);
        return deleteResponse;
    }

    private async createProjectionResponse(request: EmbeddingProjectRequest, projectionInstance: TReadModel, executionContext: ExecutionContext): Promise<ProjectionReplaceResponse | ProjectionDeleteResponse> {
        if (!request.hasEvent()) {
            throw new MissingEventInformation('No event in EmbeddingProjectRequest');
        }
        const pbEvent = request.getEvent()!;

        const pbEventSourceId = pbEvent.getEventsourceid();
        if (!pbEventSourceId) throw new MissingEventInformation('EventSourceId');

        const pbEventType = pbEvent.getEventtype();
        if (!pbEventType) throw new MissingEventInformation('Event Type');

        if (!request.getCurrentstate() || !request.getCurrentstate()?.getState()) {
            throw new MissingEventInformation('No state in ProjectionRequest');
        }

        const pbCurrentState = request.getCurrentstate()!;
        const pbStateType = pbCurrentState.getType();
        const pbKey = pbCurrentState.getKey();

        const embeddingProjectContext = new EmbeddingProjectContext(
            pbStateType === ProjectionCurrentStateType.CREATED_FROM_INITIAL_STATE,
            Key.from(pbKey),
            EventSourceId.from(pbEventSourceId),
            executionContext);

        let event = JSON.parse(pbEvent.getContent());

        const eventType = artifacts.toSDK(pbEventType, EventType.from);
        if (this._eventTypes.hasTypeFor(eventType)) {
            const typeOfEvent = this._eventTypes.getTypeFor(eventType);
            event = Object.assign(new typeOfEvent(), event);
        }

        const nextStateOrDelete = await this._embedding.on(projectionInstance, event, eventType, embeddingProjectContext);

        if (nextStateOrDelete instanceof DeleteReadModelInstance) {
            return new ProjectionDeleteResponse();
        } else {
            const replace = new ProjectionReplaceResponse();
            replace.setState(JSON.stringify(nextStateOrDelete));
            return replace;
        }
    }

    private createResponseFromError(error: any): EmbeddingResponse {
        this._logger.warn(`Processing in ${this._kind} ${this._identifier} failed. ${error.message || error}.`);
        const response = new EmbeddingResponse();
        const failure = new Failure();
        failure.setReason(`${error}`);
        response.setFailure(failure);
        return response;
    }

    private getProjectionCurrentState(request: EmbeddingRequest): ProjectionCurrentState {
        if (request.hasCompare() && request.getCompare()?.hasProjectionstate()) {
            return request.getCompare()!.getProjectionstate()!;
        } else if (request.hasDelete() && request.getDelete()?.hasProjectionstate()) {
            return request.getDelete()!.getProjectionstate()!;
        } else if (request.hasProjection() && request.getProjection()?.hasCurrentstate()) {
            return request.getProjection()!.getCurrentstate()!;
        } else {
            throw new MissingEmbeddingInformation('No compare, delete or projection request in EmbeddingRequest');
        }
    }

    private createEmbeddingContext(
        stateType: ProjectionCurrentStateType,
        key: string,
        requestCase: EmbeddingRequest.RequestCase,
        executionContext: ExecutionContext): EmbeddingContext {
        return new EmbeddingContext(
            stateType === ProjectionCurrentStateType.CREATED_FROM_INITIAL_STATE,
            Key.from(key),
            requestCase === EmbeddingRequest.RequestCase.DELETE,
            executionContext);
    }

    private createInstanceFromString(jsonString: string): TReadModel {
        let state = JSON.parse(jsonString);
        if (typeof this._embedding.readModelTypeOrInstance === 'function') {
            state = Object.assign(new (this._embedding.readModelTypeOrInstance as Constructor<TReadModel>)(), state);
        } else {
            const instanceConstructor = Object.getPrototypeOf(
                this._embedding.readModelTypeOrInstance).constructor as Constructor<TReadModel>;
            state = Object.assign(new (instanceConstructor)(), state);
        }
        return state;
    }

    private getUncommittedEvents(eventOrEvents: Object | Object[]) {
        const events = Array.isArray(eventOrEvents) ? eventOrEvents : [ eventOrEvents ];
        return events.map((sdkEvent: Object) => EventConverters.getUncommittedEmbeddingEventFrom(
            sdkEvent,
            this._eventTypes.resolveFrom(sdkEvent),
            true));
    }
}

// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';
import { Constructor } from '@dolittle/types';

import { IServiceProvider } from '@dolittle/sdk.dependencyinversion';
import { EventConverters, EventSourceId, EventType, IEventTypes } from '@dolittle/sdk.events';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { MissingEventInformation } from '@dolittle/sdk.events.processing';
import { DeleteReadModelInstance, Key } from '@dolittle/sdk.projections';
import { Artifacts, Guids } from '@dolittle/sdk.protobuf';
import { ClientProcessor, IReverseCallClient, reactiveDuplex, ReverseCallClient} from '@dolittle/sdk.services';
import { Cancellation } from '@dolittle/sdk.resilience';

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

import { EmbeddingContext } from '../EmbeddingContext';
import { EmbeddingId } from '../EmbeddingId';
import { EmbeddingProjectContext } from '../EmbeddingProjectContext';
import { MissingEmbeddingInformation } from '../MissingEmbeddingInformation';
import { IEmbedding } from './IEmbedding';

/**
 * Represents an implementation of {@link ClientProcessor} for {@link Embedding}.
 */
export class EmbeddingProcessor<TReadModel> extends ClientProcessor<EmbeddingId, EmbeddingsClient, EmbeddingRegistrationRequest, EmbeddingRegistrationResponse, EmbeddingRequest, EmbeddingResponse> {

    /**
     * Initializes a new instance of {@link EmbeddingProcessor}.
     * @template TReadModel
     * @param {IEmbedding<TReadModel>} _embedding - The embedding.
     * @param {IEventTypes} _eventTypes - The registered event types for this embedding.
     */
    constructor(
        private _embedding: IEmbedding<TReadModel>,
        private _eventTypes: IEventTypes
    ) {
        super('Embedding', _embedding.embeddingId);
    }

    /** @inheritdoc */
    protected get registerArguments(): EmbeddingRegistrationRequest {
        const registerArguments = new EmbeddingRegistrationRequest();
        registerArguments.setEmbeddingid(Guids.toProtobuf(this._embedding.embeddingId.value));

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
            events.push(Artifacts.toProtobuf(eventType));
        }
        registerArguments.setEventsList(events);
        return registerArguments;
    }

    /** @inheritdoc */
    protected createClient(
        client: EmbeddingsClient,
        registerArguments: EmbeddingRegistrationRequest,
        callback: (request: EmbeddingRequest, executionContext: ExecutionContext) => Promise<EmbeddingResponse>,
        executionContext: ExecutionContext,
        pingInterval: number,
        logger: Logger,
        cancellation: Cancellation): IReverseCallClient<EmbeddingRegistrationResponse> {
        return new ReverseCallClient<EmbeddingClientToRuntimeMessage, EmbeddingRuntimeToClientMessage, EmbeddingRegistrationRequest, EmbeddingRegistrationResponse, EmbeddingRequest, EmbeddingResponse>(
            (requests, cancellation) => reactiveDuplex(client, client.connect, requests, cancellation),
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
            executionContext,
            registerArguments,
            pingInterval,
            callback,
            cancellation,
            logger
        );
    }

    /** @inheritdoc */
    protected getFailureFromRegisterResponse(response: EmbeddingRegistrationResponse): Failure | undefined {
        return response.getFailure();
    }

    /**
     * Handles the request from the Runtime.
     * @param {EmbeddingRequest} request - The request from the Runtime.
     * @param {ExecutionContext} executionContext - The execution context for the current processing request.
     * @param {IServiceProvider} services - The service provider to use for resolving services while handling the current request.
     * @param {Logger} logger - The logger to use for logging.
     * @returns {Promise<EmbeddingResponse>} The response to the request.
     */
    async handle(request: EmbeddingRequest, executionContext: ExecutionContext, services: IServiceProvider, logger: Logger): Promise<EmbeddingResponse> {
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
    protected async catchingHandle(request: EmbeddingRequest, executionContext: ExecutionContext, services: IServiceProvider, logger: Logger): Promise<EmbeddingResponse> {
        try {
            return await this.handle(request, executionContext, services, logger);
        } catch (error) {
            return this.createResponseFromError(error, logger);
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

        const eventType = Artifacts.toSDK(pbEventType, EventType.from);
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

    private createResponseFromError(error: any, logger: Logger): EmbeddingResponse {
        logger.warn(`Processing in ${this._kind} ${this._identifier} failed. ${error.message || error}.`);
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

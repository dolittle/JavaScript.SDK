// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Observable } from 'rxjs';
import { Logger } from 'winston';
import { Duration } from 'google-protobuf/google/protobuf/duration_pb';

import { Constructor } from '@dolittle/types';
import { Guid } from '@dolittle/rudiments';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { Cancellation } from '@dolittle/sdk.resilience';
import { ClientProcessor, IReverseCallClient, reactiveDuplex, RegistrationFailed, ReverseCallClient } from '@dolittle/sdk.services';
import { EventSourceId, IEventTypes, EventConverters, EventContext, EventType } from '@dolittle/sdk.events';
import { eventTypes, guids, failures } from '@dolittle/sdk.protobuf';
import {
    EventPropertyKeySelector,
    EventSourceIdKeySelector,
    PartitionIdKeySelector,
    KeySelector,
    Key,
    UnknownKeySelectorType,
    DeleteReadModelInstance,
    ProjectionContext
} from '@dolittle/sdk.projections';

import {
    EmbeddingRegistrationRequest,
    EmbeddingRegistrationResponse,
    EmbeddingClientToRuntimeMessage,
    EmbeddingRuntimeToClientMessage,
    EmbeddingRequest,
    EmbeddingResponse,
    EmbeddingCompareRequest,
    EmbeddingCompareResponse,
    EmbeddingDeleteRequest,
    EmbeddingDeleteResponse
} from '@dolittle/runtime.contracts/Embeddings/Embeddings_pb';

import {
    ProjectionEventSelector,
    EventPropertyKeySelector as ProtobufEventPropertyKeySelector,
    PartitionIdKeySelector as ProtobufPartitionIdKeySelector,
    EventSourceIdKeySelector as ProtobufEventSourceIdKeySelector,
    ProjectionReplaceResponse,
    ProjectionDeleteResponse,
    ProjectionResponse
} from '@dolittle/runtime.contracts/Events.Processing/Projections_pb';

import { EmbeddingsClient } from '@dolittle/runtime.contracts/Embeddings/Embeddings_grpc_pb';
import { Failure } from '@dolittle/contracts/Protobuf/Failure_pb';
import { RetryProcessingState, ProcessorFailure } from '@dolittle/runtime.contracts/Events.Processing/Processors_pb';
import { ProjectionCurrentState, ProjectionCurrentStateType } from '@dolittle/runtime.contracts/Projections/State_pb';

import {
    IEmbedding,
    EmbeddingId,
    EmbeddingContext
} from '..';
import { UncommittedEvent } from '@dolittle/runtime.contracts/Events/Uncommitted_pb';
import { MissingEmbeddingInformation } from '../MissingEmbeddingInformation';
import { MissingEventInformation } from '@dolittle/sdk.events.processing';
import { DateTime } from 'luxon';
import { Artifact } from '@dolittle/contracts/Artifacts/Artifact_pb';


/**
 * Represents an implementation of {@link EventProcessor} for {@link Embedding}.
 */
export class EmbeddingProcessor<T> extends ClientProcessor<EmbeddingId, EmbeddingRegistrationRequest, EmbeddingRegistrationResponse, EmbeddingRequest, EmbeddingResponse> {
    private _pingTimeout = 1;

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
        private _logger: Logger
    ) {
        super('Embedding', _embedding.embeddingId);
    }

    protected register(cancellation: Cancellation): Observable<never> {
        const client = this.createClient(
            this.registerArguments,
            (request: EmbeddingRequest, executionContext: ExecutionContext) => this.catchingHandle(request, executionContext),
            this._pingTimeout,
            cancellation);
        return new Observable<never>(subscriber => {
            this._logger.debug(`Registering ${this._kind} ${this._identifier} with the Runtime.`);
            client.subscribe({
                next: (message: EmbeddingRegistrationResponse) => {
                    const failure = this.getFailureFromRegisterResponse(message);
                    if (failure) {
                        subscriber.error(new RegistrationFailed(this._kind, this._identifier.value, failures.toSDK(failure)!));
                    } else {
                        this._logger.debug(`${this._kind} ${this._identifier} registered with the Runtime, start handling requests.`);
                    }
                },
                error: (error: Error) => {
                    subscriber.error(error);
                },
                complete: () => {
                    this._logger.debug(`Registering ${this._kind} ${this._identifier} handling of requests completed.`);
                    subscriber.complete();
                },
            });
        });
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

        const events: Artifact[] = [];
        for (const eventSelector of this._embedding.events) {
            events.push(eventTypes.toProtobuf(eventSelector.eventType));
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

    protected getFailureFromRegisterResponse(response: EmbeddingRegistrationResponse): Failure | undefined {
        return response.getFailure();
    }

    protected getRetryProcessingStateFromRequest(request: EmbeddingRequest): RetryProcessingState | undefined {
        if (request.hasProjection() && request.getProjection()?.hasRetryprocessingstate()) {
            return request.getProjection()?.getRetryprocessingstate();
        }
    }

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

    private async catchingHandle(request: EmbeddingRequest, executionContext: ExecutionContext): Promise<EmbeddingResponse> {
        let retryProcessingState: RetryProcessingState | undefined;
        try {
            retryProcessingState = this.getRetryProcessingStateFromRequest(request);
            return await this.handle(request, executionContext);
        } catch (error) {
            return this.createResponseFromError(error, retryProcessingState);
        }
    }

    private async createCompareResponse(request: EmbeddingCompareRequest, projectionInstance: T, context: EmbeddingContext): Promise<EmbeddingCompareResponse> {
        const entityState = this.createInstanceFromString(request.getEntitystate());

        const events = this.getUncommittedEvents(await this._embedding.compare(entityState, projectionInstance, context));

        const compareResponse = new EmbeddingCompareResponse();
        compareResponse.setEventsList(events);
        return compareResponse;
    }

    private async createDeleteResponse(projectionInstance: T, context: EmbeddingContext): Promise<EmbeddingDeleteResponse> {
        const events = this.getUncommittedEvents(await this._embedding.delete(projectionInstance, context));

        const deleteResponse = new EmbeddingDeleteResponse();
        deleteResponse.setEventsList(events);
        return deleteResponse;
    }

    private async createProjectionResponse(request: EmbeddingRequest.ProjectionRequest, projectionInstance: T, executionContext: ExecutionContext): Promise<ProjectionReplaceResponse | ProjectionDeleteResponse> {
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

        const nextStateOrDelete = await this._embedding.on(projectionInstance, event, eventType, projectionContext);

        if (nextStateOrDelete instanceof DeleteReadModelInstance) {
            return new ProjectionDeleteResponse();
        } else {
            const replace = new ProjectionReplaceResponse();
            replace.setState(JSON.stringify(nextStateOrDelete));
            return replace;
        }
    }

    private createResponseFromError(error: any, retryProcessing: RetryProcessingState | undefined): EmbeddingResponse {
        const response = new EmbeddingResponse();
        if (retryProcessing) {
            const failure = new ProcessorFailure();
            failure.setReason(`${error}`);
            failure.setRetry(true);
            const retryAttempt = (retryProcessing?.getRetrycount() ?? 0) + 1;
            const retrySeconds = Math.min(5 * retryAttempt, 60);
            const retryTimeout = new Duration();
            retryTimeout.setSeconds(retrySeconds);
            failure.setRetrytimeout(retryTimeout);
            response.setProcessorfailure(failure);
            this._logger.warn(`Processing in ${this._kind} ${this._identifier} failed. ${error.message || error}. Will retry in ${retrySeconds}`);
        } else {
            const failure = new Failure();
            failure.setReason(`${error}`);
            response.setFailure(failure);
            this._logger.warn(`Processing in ${this._kind} ${this._identifier} failed. ${error.message || error}.`);
        }
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

    private createInstanceFromString(jsonString: string): T {
        let state = JSON.parse(jsonString);
        if (typeof this._embedding.readModelTypeOrInstance === 'function') {
            state = Object.assign(new (this._embedding.readModelTypeOrInstance as Constructor<T>)(), state);
        } else {
            const instanceConstructor = Object.getPrototypeOf(
                this._embedding.readModelTypeOrInstance).constructor as Constructor<T>;
            state = Object.assign(new (instanceConstructor)(), state);
        }
        return state;
    }

    private getUncommittedEvents(...events: any) {
        return events.map((sdkEvent: any) => EventConverters.getUncommittedEmbeddingEventFrom(
            sdkEvent,
            this._eventTypes.resolveFrom(sdkEvent),
            true));
    }
}

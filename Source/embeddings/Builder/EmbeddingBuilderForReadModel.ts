// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { EmbeddingsClient } from '@dolittle/runtime.contracts/Embeddings/Embeddings_grpc_pb';
import { IContainer } from '@dolittle/sdk.common';
import { EventType, EventTypeId, EventTypeMap, Generation, IEventTypes } from '@dolittle/sdk.events';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { TypeOrEventType } from '@dolittle/sdk.projections';
import { Cancellation } from '@dolittle/sdk.resilience';
import { Constructor } from '@dolittle/types';
import { Logger } from 'winston';
import { EmbeddingCompareCallback, EmbeddingDeleteCallback, EmbeddingId, EmbeddingProjectCallback } from '..';
import { Embedding, EmbeddingProcessor, IEmbeddings } from '../Internal';
import { EmbeddingAlreadyHasAnUpdateMethod } from './EmbeddingAlreadyHasAnUpdateMethod';
import { EmbeddingAlreadyHasADeletionMethod } from './EmbeddingAlreadyHasADeletionMethod';
import { ICanBuildAndRegisterAnEmbedding } from './ICanBuildAndRegisterAnEmbedding';


// type OnMethodSpecification<TCallback> = [TypeOrEventType, TCallback];
/**
 * Represents a builder for building {@link IEmbedding}.
 */
export class EmbeddingBuilderForReadModel<T> implements ICanBuildAndRegisterAnEmbedding {
    private _compareMethod?: EmbeddingCompareCallback<T> = undefined;
    private _removeMethod?: EmbeddingDeleteCallback<T> = undefined;
    private _onMethods: [TypeOrEventType, EmbeddingProjectCallback<T>][] = [];

    /**
     * Initializes a new instance of {@link EmbeddingBuilder}.
     * @param {EmbeddingId} _embeddingId  The unique identifier of the embedding to build for
     * @param {Constructor<T> | T} _readModelTypeOrInstance  The read model type or instance
     */
    constructor(
        private readonly _embeddingId: EmbeddingId,
        private readonly _readModelTypeOrInstance: Constructor<T> | T) {
    }

    /**
     * Add a resolveUpdateToEvents method for comparing the resolveUpdateToEvents received and current states of the embedding.
     * @param {EmbeddingCompareCallback} callback Callback to call until the current state equals the received state.
     * @returns {EmbeddingBuilderForReadModel<T>}
     */
    resolveUpdateToEvents(callback: EmbeddingCompareCallback<T>): EmbeddingBuilderForReadModel<T> {
        if (this._compareMethod) {
            throw new EmbeddingAlreadyHasAnUpdateMethod(this._embeddingId);
        }
        this._compareMethod = callback;
        return this;
    }

    /**
     * Add a resolveDeletionToEvents method for deleting the embedding.
     * @param {EmbeddingCompareCallback} callback Callback to call until the embedding has been deleted.
     * @returns {EmbeddingBuilderForReadModel<T>}
     */
    resolveDeletionToEvents(callback: EmbeddingDeleteCallback<T>): EmbeddingBuilderForReadModel<T> {
        if (this._removeMethod) {
            throw new EmbeddingAlreadyHasADeletionMethod(this._embeddingId);
        }
        this._removeMethod = callback;
        return this;
    }

    /**
     * Add an on method for handling the event.
     * @template TEvent Type of event.
     * @param {Constructor<TEvent>} type The type of event.
     * @param {EmbeddingProjectCallback<T,TEvent>} callback Callback to call for each event.
     * @returns {ProjectionBuilderForReadModel<T, TEvent>}
     */
    on<TEvent>(type: Constructor<TEvent>, callback: EmbeddingProjectCallback<T, TEvent>): this;
    /**
     * Add an on method for handling the event.
     * @param {EventType} eventType The identifier of the event.
     * @param {EmbeddingProjectCallback} callback Callback to call for each event.
     * @returns {ProjectionBuilderForReadModel<T>}
     */
    on(eventType: EventType, callback: EmbeddingProjectCallback<T>): this;
    /**
     * Add an on method for handling the event.
     * @param {EventTypeId|Guid|string} eventType The identifier of the event.
     * @param {EmbeddingProjectCallback} callback Callback to call for each event.
     * @returns {ProjectionBuilderForReadModel<T>}
     */
    on(eventTypeId: EventTypeId | Guid | string, callback: EmbeddingProjectCallback<T>): this;
    /**
     * Add an on method for handling the event.
     * @param {EventTypeId | Guid | string} eventType The identifier of the event.
     * @param {Generation | number} generation The generation of the event type.
     * @param {EmbeddingProjectCallback} method Callback to call for each event.
     * @returns {ProjectionBuilderForReadModel<T>}
     */
    on(eventTypeId: EventTypeId | Guid | string, generation: Generation | number, callback: EmbeddingProjectCallback<T>): this;
    on<TEvent = any>(
        typeOrEventTypeOrId: Constructor<TEvent> | EventType | EventTypeId | Guid | string,
        callbackOrGeneration: Generation | number | EmbeddingProjectCallback<T, TEvent>,
        maybeCallback?: EmbeddingProjectCallback<T, TEvent>): this {
        const typeOrEventType = this.getTypeOrEventTypeFrom<TEvent>(typeOrEventTypeOrId, callbackOrGeneration);
        const callback = typeof callbackOrGeneration === 'function'
            ? callbackOrGeneration
            : maybeCallback!;
        this._onMethods.push([typeOrEventType, callback]);
        return this;
    }

    /** @inheritdoc */
    buildAndRegister(
        client: EmbeddingsClient,
        embeddings: IEmbeddings,
        container: IContainer,
        executionContext: ExecutionContext,
        eventTypes: IEventTypes,
        logger: Logger,
        cancellation: Cancellation): void {
        const events = this.buildOnMethods(eventTypes, logger);
        const canRegister = this.canRegisterEmbedding(logger);
        if (!canRegister || !events) {
            return;
        }
        const embedding = new Embedding<T>(this._embeddingId, this._readModelTypeOrInstance, events, this._compareMethod!, this._removeMethod!);
        embeddings.register<T>(
            new EmbeddingProcessor<T>(
                embedding,
                client,
                executionContext,
                eventTypes,
                logger
            ), cancellation);
    }

    private getTypeOrEventTypeFrom<TEvent>(
        typeOrEventTypeOrId: string | Constructor<TEvent> | EventType | EventTypeId | Guid,
        callbackOrGeneration: Generation | number | EmbeddingProjectCallback<T>) {
        if (typeof typeOrEventTypeOrId === 'function') {
            return typeOrEventTypeOrId;
        }

        if (typeOrEventTypeOrId instanceof EventType) {
            return typeOrEventTypeOrId;
        }

        const eventTypeId = typeOrEventTypeOrId;
        const eventTypeGeneration = typeof callbackOrGeneration === 'function' ? Generation.first : callbackOrGeneration;

        return new EventType(EventTypeId.from(eventTypeId), Generation.from(eventTypeGeneration));
    }

    private buildOnMethods(eventTypes: IEventTypes, logger: Logger) {
        const events = new EventTypeMap<EmbeddingProjectCallback<T>>();
        const allMethodsBuilt = this.tryAddOnMethods(eventTypes, events);
        if (!allMethodsBuilt) {
            logger.warn(`Failed to register embedding ${this._embeddingId}. Couldn't build the @on methods. Maybe an event type is handled twice?`);
            return false;
        }
        return events;
    }

    private tryAddOnMethods(
        eventTypes: IEventTypes,
        events: EventTypeMap<EmbeddingProjectCallback<T>>): boolean {
        let allMethodsValid = true;
        for (const [typeOrEventType, callback] of this._onMethods) {
            const eventType = typeOrEventType instanceof EventType
                ? typeOrEventType
                : eventTypes.getFor(typeOrEventType);
            if (events.has(eventType)) {
                allMethodsValid = false;
            }
            events.set(eventType, callback);
        }
        return allMethodsValid;
    }

    private canRegisterEmbedding(logger: Logger): boolean {
        if (this._onMethods.length < 1) {
            logger.warn(`Failed to register embedding ${this._embeddingId}. No @on methods are configured`);
            return false;
        }
        if (this._compareMethod === undefined) {
            logger.warn(`Failed to register embedding ${this._embeddingId}. No compare method defined.`);
            return false;
        }
        if (this._removeMethod === undefined) {
            logger.warn(`Failed to register embedding ${this._embeddingId}. No delete method defined.`);
            return false;
        }
        return true;
    }
}

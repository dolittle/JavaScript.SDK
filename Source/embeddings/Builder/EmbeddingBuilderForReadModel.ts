// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

import { Generation, GenerationLike } from '@dolittle/sdk.artifacts';
import { IClientBuildResults } from '@dolittle/sdk.common/ClientSetup';
import { EventType, EventTypeId, EventTypeIdLike, EventTypeMap, IEventTypes } from '@dolittle/sdk.events';
import { TypeOrEventType } from '@dolittle/sdk.projections';

import { EmbeddingDeleteCallback } from '../EmbeddingDeleteCallback';
import { EmbeddingProjectCallback } from '../EmbeddingProjectCallback';
import { EmbeddingUpdateCallback } from '../EmbeddingUpdateCallback';
import { EmbeddingId } from '../EmbeddingId';
import { Embedding } from '../Internal/Embedding';
import { IEmbedding } from '../Internal/IEmbedding';
import { EmbeddingAlreadyHasAnUpdateMethod } from './EmbeddingAlreadyHasAnUpdateMethod';
import { EmbeddingAlreadyHasADeletionMethod } from './EmbeddingAlreadyHasADeletionMethod';
import { IEmbeddingBuilderForReadModel } from './IEmbeddingBuilderForReadModel';
/**
 * Represents an implementation of {@link IEmbeddingBuilderForReadModel}.
 * @template T The type of the embedding read model.
 */
export class EmbeddingBuilderForReadModel<T> extends IEmbeddingBuilderForReadModel<T> {
    private _updateMethod?: EmbeddingUpdateCallback<T> = undefined;
    private _deleteMethod?: EmbeddingDeleteCallback<T> = undefined;
    private _onMethods: [TypeOrEventType, EmbeddingProjectCallback<T>][] = [];

    /**
     * Initializes a new instance of {@link EmbeddingBuilder}.
     * @param {EmbeddingId} _embeddingId - The unique identifier of the embedding to build for.
     * @param {Constructor<T> | T} _readModelTypeOrInstance - The read model type or instance.
     */
    constructor(
        private readonly _embeddingId: EmbeddingId,
        private readonly _readModelTypeOrInstance: Constructor<T> | T
    ) {
        super();
    }

    /** @inheritdoc */
    resolveUpdateToEvents(callback: EmbeddingUpdateCallback<T>): IEmbeddingBuilderForReadModel<T> {
        if (this._updateMethod) {
            throw new EmbeddingAlreadyHasAnUpdateMethod(this._embeddingId);
        }
        this._updateMethod = callback;
        return this;
    }

    /** @inheritdoc */
    resolveDeletionToEvents(callback: EmbeddingDeleteCallback<T>): IEmbeddingBuilderForReadModel<T> {
        if (this._deleteMethod) {
            throw new EmbeddingAlreadyHasADeletionMethod(this._embeddingId);
        }
        this._deleteMethod = callback;
        return this;
    }

    /** @inheritdoc */
    on<TEvent>(type: Constructor<TEvent>, callback: EmbeddingProjectCallback<T, TEvent>): IEmbeddingBuilderForReadModel<T>;
    on(eventType: EventType, callback: EmbeddingProjectCallback<T, any>): IEmbeddingBuilderForReadModel<T>;
    on(eventTypeId: string | Guid | EventTypeId, callback: EmbeddingProjectCallback<T, any>): IEmbeddingBuilderForReadModel<T>;
    on(eventTypeId: EventTypeIdLike, generation: GenerationLike, callback: EmbeddingProjectCallback<T, any>): IEmbeddingBuilderForReadModel<T>;
    on<TEvent = any>(
        typeOrEventTypeOrId: Constructor<TEvent> | EventType | EventTypeId | Guid | string,
        callbackOrGeneration: GenerationLike | EmbeddingProjectCallback<T, TEvent>,
        maybeCallback?: EmbeddingProjectCallback<T, TEvent>
    ): IEmbeddingBuilderForReadModel<T> {
        const typeOrEventType = this.getTypeOrEventTypeFrom<TEvent>(typeOrEventTypeOrId, callbackOrGeneration);
        const callback = typeof callbackOrGeneration === 'function'
            ? callbackOrGeneration
            : maybeCallback!;
        this._onMethods.push([typeOrEventType, callback]);
        return this;
    }

    /**
     * Builds the embedding.
     * @param {IEventTypes} eventTypes - For event types resolution.
     * @param {IClientBuildResults} results - For keeping track of build results.
     * @returns {IEmbedding | undefined} The built embedding if successful.
     */
    build(eventTypes: IEventTypes, results: IClientBuildResults): IEmbedding<T> | undefined {
        const events = this.buildOnMethods(eventTypes, results);
        const canRegister = this.canRegisterEmbedding(results);
        if (!canRegister || !events) {
            return;
        }
        return new Embedding<T>(this._embeddingId, this._readModelTypeOrInstance, events, this._updateMethod!, this._deleteMethod!);
    }

    private getTypeOrEventTypeFrom<TEvent>(
        typeOrEventTypeOrId: string | Constructor<TEvent> | EventType | EventTypeId | Guid,
        callbackOrGeneration: GenerationLike | EmbeddingProjectCallback<T>) {
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

    private buildOnMethods(eventTypes: IEventTypes, results: IClientBuildResults) {
        const events = new EventTypeMap<EmbeddingProjectCallback<T>>();
        const allMethodsBuilt = this.tryAddOnMethods(eventTypes, events);
        if (!allMethodsBuilt) {
            results.addFailure(`Failed to register embedding ${this._embeddingId}. Couldn't build the @on methods`, 'Maybe an event type is handled twice?');
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

    private canRegisterEmbedding(results: IClientBuildResults): boolean {
        if (this._onMethods.length < 1) {
            results.addFailure(`Failed to register embedding ${this._embeddingId}. No @on methods are configured`);
            return false;
        }
        if (this._updateMethod === undefined) {
            results.addFailure(`Failed to register embedding ${this._embeddingId}. No resolveUpdateToEvents() method defined.`);
            return false;
        }
        if (this._deleteMethod === undefined) {
            results.addFailure(`Failed to register embedding ${this._embeddingId}. No resolveDeletionToEvents() method defined.`);
            return false;
        }
        return true;
    }
}

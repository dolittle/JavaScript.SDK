// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { EventType, EventTypeMap } from '@dolittle/sdk.events';
import {
    DeleteReadModelInstance,
    EventSelector,
    KeySelector,
    MissingOnMethodForType,
    ProjectionId
} from '@dolittle/sdk.projections';
import { Constructor } from '@dolittle/types';
import {
    EmbeddingUpdateCallback,
    EmbeddingContext,
    EmbeddingDeleteCallback,
    EmbeddingId,
    EmbeddingProjectCallback,
    EmbeddingProjectContext
} from '..';
import { IEmbedding } from './IEmbedding';


/**
 * Represents an implementation of {@link IEmbedding<T>}.
 */
export class Embedding<T> implements IEmbedding<T> {

    /** @inheritdoc */
    readonly events: Iterable<EventType>;

    /**
     * Initializes a new instance of {@link Embedding}
     * @param {EmbeddingId} embeddingId The unique identifier for the embedding.
     * @param {Constructor<T> | T} readModelTypeOrInstance The read model type or instance produced by the embedding.
     * @param {EventTypeMap<EmbeddingProjectCallback<any>>} events The events with their respective callbacks in the embedding.
     * @param {EmbeddingUpdateCallback} _updateMethod The compare method for the embedding.
     */
    constructor(
        readonly embeddingId: EmbeddingId,
        readonly readModelTypeOrInstance: Constructor<T> | T,
        private readonly _eventMap: EventTypeMap<EmbeddingProjectCallback<T>>,
        private readonly _updateMethod: EmbeddingUpdateCallback,
        private readonly _deleteMethod: EmbeddingDeleteCallback) {
        this.events = this._eventMap.keys();
    }

    /** @inheritdoc */
    async on(readModel: T, event: any, eventType: EventType, context: EmbeddingProjectContext): Promise<T | DeleteReadModelInstance> {
        if (this._eventMap.has(eventType)) {
            const method = this._eventMap.get(eventType)!;
            return method(readModel, event, context);
        } else {
            throw new MissingOnMethodForType(ProjectionId.from(this.embeddingId.value), eventType);
        }
    }

    /** @inheritdoc */
    compare(receivedState: T, currentState: T, context: EmbeddingContext) {
        return this._updateMethod(receivedState, currentState, context);
    }

    /** @inheritdoc */
    delete(currentState: T, context: EmbeddingContext) {
        return this._deleteMethod(currentState, context);
    }
}

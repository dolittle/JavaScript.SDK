// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';

import { EventType, EventTypeMap } from '@dolittle/sdk.events';
import { DeleteReadModelInstance, MissingOnMethodForType, ProjectionId } from '@dolittle/sdk.projections';

import { EmbeddingId } from '../EmbeddingId';
import { EmbeddingDeleteCallback } from '../EmbeddingDeleteCallback';
import { EmbeddingContext } from '../EmbeddingContext';
import { EmbeddingProjectCallback } from '../EmbeddingProjectCallback';
import { EmbeddingProjectContext } from '../EmbeddingProjectContext';
import { EmbeddingUpdateCallback } from '../EmbeddingUpdateCallback';
import { EmbeddingDeleteMethodFailed } from './EmbeddingDeleteMethodFailed';
import { EmbeddingUpdateMethodFailed } from './EmbeddingUpdateMethodFailed';
import { IEmbedding } from './IEmbedding';

/**
 * Represents an implementation of {@link IEmbedding<TReadModel>}.
 * @template TReadModel The type of the embedding read model.
 */
export class Embedding<TReadModel> implements IEmbedding<TReadModel> {

    /** @inheritdoc */
    readonly events: Iterable<EventType>;

    /**
     * Initializes a new instance of {@link Embedding}.
     * @param {EmbeddingId} embeddingId - The unique identifier for the embedding.
     * @param {Constructor<TReadModel> | TReadModel} readModelTypeOrInstance - The read model type or instance produced by the embedding.
     * @param {EventTypeMap<EmbeddingProjectCallback<any>>} _eventMap - The events with their respective callbacks in the embedding.
     * @param {EmbeddingUpdateCallback} _updateMethod - The update method for the embedding.
     * @param {EmbeddingDeleteCallback} _deleteMethod - The delete method for the embedding.
     */
    constructor(
        readonly embeddingId: EmbeddingId,
        readonly readModelTypeOrInstance: Constructor<TReadModel> | TReadModel,
        private readonly _eventMap: EventTypeMap<EmbeddingProjectCallback<TReadModel>>,
        private readonly _updateMethod: EmbeddingUpdateCallback,
        private readonly _deleteMethod: EmbeddingDeleteCallback) {
        this.events = this._eventMap.keys();
    }

    /** @inheritdoc */
    async on(readModel: TReadModel, event: any, eventType: EventType, context: EmbeddingProjectContext): Promise<TReadModel | DeleteReadModelInstance> {
        if (this._eventMap.has(eventType)) {
            const method = this._eventMap.get(eventType)!;
            return method(readModel, event, context);
        } else {
            throw new MissingOnMethodForType(ProjectionId.from(this.embeddingId.value), eventType);
        }
    }

    /** @inheritdoc */
    update(receivedState: TReadModel, currentState: TReadModel, context: EmbeddingContext) {
        try {
            return this._updateMethod(receivedState, currentState, context);
        } catch (error) {
            throw new EmbeddingUpdateMethodFailed<TReadModel>(this.embeddingId, receivedState, currentState, context, error);
        }
    }

    /** @inheritdoc */
    delete(currentState: TReadModel, context: EmbeddingContext) {

        try {
            return this._deleteMethod(currentState, context);
        } catch (error) {
            throw new EmbeddingDeleteMethodFailed<TReadModel>(this.embeddingId, currentState, context, error);
        }
    }
}

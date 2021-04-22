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
import { EmbeddingCompareCallback } from './EmbeddingCompareCallback';
import { EmbeddingContext } from './EmbeddingContext';
import { EmbeddingDeleteCallback } from './EmbeddingDeleteCallback';
import { EmbeddingId } from './EmbeddingId';
import { EmbeddingProjectCallback } from './EmbeddingProjectCallback';
import { EmbeddingProjectContext } from './EmbeddingProjectContext';
import { IEmbedding } from './IEmbedding';


/** @inheritdoc */
export class Embedding<T> implements IEmbedding<T> {

    /** @inheritdoc */
    readonly events: Iterable<EventSelector>;

    /**
     * Initializes a new instance of {@link Embedding}
     * @param {EmbeddingId} embeddingId The unique identifier for the embedding.
     * @param {Constructor<T>|T} readModelTypeOrInstance The read model type or instance produced by the embedding.
     * @param {EventTypeMap<[EmbeddingProjectCallback<any>, KeySelector]>} events The events with respective callbacks and keyselectors used by the embedding.
     * @param {EmbeddingCompareCallback} _compareMethod The compare method for the embedding.
     */
    constructor(
        readonly embeddingId: EmbeddingId,
        readonly readModelTypeOrInstance: Constructor<T> | T,
        private readonly _eventMap: EventTypeMap<[EmbeddingProjectCallback<any>, KeySelector]>,
        private readonly _compareMethod: EmbeddingCompareCallback,
        private readonly _deleteMethod: EmbeddingDeleteCallback) {
        const eventSelectors: EventSelector[] = [];
        for (const [eventType, [, keySelector]] of this._eventMap.entries()) {
            eventSelectors.push(new EventSelector(eventType, keySelector));
        }
        this.events = eventSelectors;
    }

    /** @inheritdoc */
    async on(readModel: T, event: any, eventType: EventType, context: EmbeddingProjectContext): Promise<T | DeleteReadModelInstance> {
        if (this._eventMap.has(eventType)) {
            const [method] = this._eventMap.get(eventType)!;
            return method(readModel, event, context);
        } else {
            throw new MissingOnMethodForType(ProjectionId.from(this.embeddingId.value), eventType);
        }
    }

    /** @inheritdoc */
    compare(receivedState: T, currentState: T, context: EmbeddingContext) {
        return this._compareMethod(receivedState, currentState, context);
    }

    /** @inheritdoc */
    delete(currentState: T, context: EmbeddingContext) {
        return this._deleteMethod(currentState, context);
    }
}

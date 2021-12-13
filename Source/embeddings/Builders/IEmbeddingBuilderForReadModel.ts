// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

import { GenerationLike } from '@dolittle/sdk.artifacts';
import { EventType, EventTypeId, EventTypeIdLike } from '@dolittle/sdk.events';

import { EmbeddingDeleteCallback } from '../EmbeddingDeleteCallback';
import { EmbeddingProjectCallback } from '../EmbeddingProjectCallback';
import { EmbeddingUpdateCallback } from '../EmbeddingUpdateCallback';

/**
 * Defines a builder for building an embedding for a readmodel from method callbacks.
 * @template T The type of the embedding read model.
 */
export abstract class IEmbeddingBuilderForReadModel<T> {
    /**
     * Add the resolveUpdateToEvents method for resolving the received and current states of the embedding into events.
     * @param {EmbeddingUpdateCallback} callback - Callback to call until the current state equals the received state.
     * @returns {IEmbeddingBuilderForReadModel<T>} The builder for continuation.
     */
    abstract resolveUpdateToEvents(callback: EmbeddingUpdateCallback<T>): IEmbeddingBuilderForReadModel<T>;

    /**
     * Add a resolveDeletionToEvents method for deleting the embedding.
     * @param {EmbeddingUpdateCallback} callback - Callback to call until the embedding has been deleted.
     * @returns {IEmbeddingBuilderForReadModel<T>} The builder for continuation.
     */
    abstract resolveDeletionToEvents(callback: EmbeddingDeleteCallback<T>): IEmbeddingBuilderForReadModel<T>;

    /**
     * Add an on method for handling the event.
     * @template TEvent Type of event.
     * @param {Constructor<TEvent>} type - The type of event.
     * @param {EmbeddingProjectCallback<T,TEvent>} callback - Callback to call for each event.
     * @returns {IEmbeddingBuilderForReadModel<T>} The builder for continuation.
     */
    abstract on<TEvent>(type: Constructor<TEvent>, callback: EmbeddingProjectCallback<T, TEvent>): IEmbeddingBuilderForReadModel<T>;

    /**
     * Add an on method for handling the event.
     * @param {EventType} eventType - The identifier of the event.
     * @param {EmbeddingProjectCallback} callback - Callback to call for each event.
     * @returns {IEmbeddingBuilderForReadModel<T>} The builder for continuation.
     */
    abstract on(eventType: EventType, callback: EmbeddingProjectCallback<T>): IEmbeddingBuilderForReadModel<T>;

    /**
     * Add an on method for handling the event.
     * @param {EventTypeId|Guid|string} eventType - The identifier of the event.
     * @param {EmbeddingProjectCallback} callback - Callback to call for each event.
     * @returns {IEmbeddingBuilderForReadModel<T>} The builder for continuation.
     */
    abstract on(eventTypeId: EventTypeId | Guid | string, callback: EmbeddingProjectCallback<T>): IEmbeddingBuilderForReadModel<T>;

    /**
     * Add an on method for handling the event.
     * @param {EventTypeIdLike} eventType - The identifier of the event.
     * @param {GenerationLike} generation - The generation of the event type.
     * @param {EmbeddingProjectCallback} method - Callback to call for each event.
     * @returns {IEmbeddingBuilderForReadModel<T>} The builder for continuation.
     */
    abstract on(eventTypeId: EventTypeIdLike, generation: GenerationLike, callback: EmbeddingProjectCallback<T>): IEmbeddingBuilderForReadModel<T>;
}

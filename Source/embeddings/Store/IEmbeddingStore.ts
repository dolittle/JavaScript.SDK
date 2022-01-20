// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

import { CurrentState, Key } from '@dolittle/sdk.projections';
import { Cancellation } from '@dolittle/sdk.resilience';

import { EmbeddingId } from '../EmbeddingId';

/**
 * Defines the API surface for getting embeddings.
 */
export abstract class IEmbeddingStore {
    /**
     * Gets an embedding state by key for an embedding associated with a type.
     * @param {Constructor<TEmbedding>} type - The type of the embedding.
     * @param {Key | any} key - The key of the embedding.
     * @param {Cancellation} [cancellation] - The cancellation token.
     * @returns {Promise<CurrentState<TEmbedding>>} A {@link Promise} that when resolved returns the current state of the embedding.
     * @template TEmbedding The type of the the embedding.
     */
    abstract get<TEmbedding>(type: Constructor<TEmbedding>, key: Key | any, cancellation?: Cancellation): Promise<CurrentState<TEmbedding>>;

    /**
     * Gets an embedding state by key for an embedding specified by embedding identifier.
     * @param {Constructor<TEmbedding>} type - The type of the embedding.
     * @param {Key | any} key - The key of the embedding.
     * @param {EmbeddingId | Guid | string} embedding - The id of the embedding.
     * @param {Cancellation} [cancellation] - The cancellation token.
     * @returns {Promise<CurrentState<TEmbedding>>} A {@link Promise} that when resolved returns the current state of the embedding.
     * @template TEmbedding The type of the the embedding.
     */
    abstract get<TEmbedding>(type: Constructor<TEmbedding>, key: Key | any, embedding: EmbeddingId | Guid | string, cancellation?: Cancellation): Promise<CurrentState<TEmbedding>>;

    /**
     * Gets an embedding state by key for an embedding specified by embedding identifier.
     * @param {Key | any} key - The key of the embedding.
     * @param {EmbeddingId | Guid | string} embedding - The id of the embedding.
     * @param {Cancellation} [cancellation] - The cancellation token.
     * @returns {Promise<CurrentState<any>>} A {@link Promise} that when resolved returns the current state of the embedding.
     */
    abstract get(key: Key | any, embedding: EmbeddingId | Guid | string, cancellation?: Cancellation): Promise<CurrentState<any>>;

    /**
     * Gets all embedding states for an embedding associated with a type.
     * @param {Constructor<TEmbedding>} type - The type of the embedding.
     * @param {Cancellation} [cancellation] - The cancellation token.
     * @returns {Promise<Map<Key, CurrentState<TEmbedding>>>} A {@link Promise} that when resolved returns the current state of all embeddings.
     * @template TEmbedding The type of the the embedding.
     */
    abstract getAll<TEmbedding>(type: Constructor<TEmbedding>, cancellation?: Cancellation): Promise<Map<Key, CurrentState<TEmbedding>>>;

    /**
     * Gets all embedding states for an embedding specified by embedding identifier.
     * @param {Constructor<TEmbedding>} type - The type of the embedding.
     * @param {EmbeddingId | Guid | string} embedding - The id of the embedding.
     * @param {Cancellation} [cancellation] - The cancellation token.
     * @returns {Promise<Map<Key, CurrentState<TEmbedding>>>} A {@link Promise} that when resolved returns the current state of all embeddings.
     * @template TEmbedding The type of the the embedding.
     */
    abstract getAll<TEmbedding>(type: Constructor<TEmbedding>, embedding: EmbeddingId | Guid | string, cancellation?: Cancellation): Promise<Map<Key, CurrentState<TEmbedding>>>;

    /**
     * Gets all embedding states for an embedding specified by embedding identifier.
     * @param {EmbeddingId | Guid | string} embedding - The id of the embedding.
     * @param {Cancellation} [cancellation] - The cancellation token.
     * @returns {Promise<Map<Key, CurrentState<any>>>} A {@link Promise} that when resolved returns the current state of all embeddings.
     */
    abstract getAll(embedding: EmbeddingId | Guid | string, cancellation?: Cancellation): Promise<Map<Key,CurrentState<any>>>;

    /**
     * Gets all the keys for an embedding associated with a type.
     * @param {Constructor<TEmbedding>} type - The type of the embedding.
     * @param {Cancellation} [cancellation] - The cancellation token.
     * @returns {Promise<Key[]>} A {@link Promise} that when resolved returns all embedding keys.
     * @template TEmbedding The type of the the embedding.
     */
    abstract getKeys<TEmbedding>(type: Constructor<TEmbedding>, cancellation?: Cancellation): Promise<Key[]>;

    /**
     * Gets all the keys for an embedding specified by embedding identifier.
     * @param {Constructor<TEmbedding>} type - The type of the embedding.
     * @param {EmbeddingId | Guid | string} embedding - The id of the embedding.
     * @param {Cancellation} [cancellation] - The cancellation token.
     * @returns {Promise<Key[]>} A {@link Promise} that when resolved returns all embedding keys.
     * @template TEmbedding The type of the the embedding.
     */
    abstract getKeys<TEmbedding>(type: Constructor<TEmbedding>, embedding: EmbeddingId | Guid | string, cancellation?: Cancellation): Promise<Key[]>;

    /**
     * Gets all the keys for an embedding specified by embedding identifier.
     * @param {EmbeddingId | Guid | string} embedding - The id of the embedding.
     * @param {Cancellation} [cancellation] - The cancellation token.
     * @returns {Promise<Key[]>} A {@link Promise} that when resolved returns all embedding keys.
     */
    abstract getKeys(embedding: EmbeddingId | Guid | string, cancellation?: Cancellation): Promise<Key[]>;
}

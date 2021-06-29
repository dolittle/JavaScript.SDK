// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { CurrentState, Key } from '@dolittle/sdk.projections';
import { Cancellation } from '@dolittle/sdk.resilience';
import { Constructor } from '@dolittle/types';
import { EmbeddingId } from '..';

/**
 * Defines the API surface for getting embeddings.
 */
export abstract class IEmbeddingStore {
    /**
     * Gets an embedding state by key for an embedding associated with a type.
     * @template TEmbedding
     * @param {Constructor<T>} type The type of the embedding.
     * @param {Key | any} key The key of the embedding.
     * @param {Cancellation} [cancellation] The cancellation token.
     * @returns {Promise<CurrentState<TEmbedding>>}
     */
    abstract get<TEmbedding> (type: Constructor<TEmbedding>, key: Key | any, cancellation?: Cancellation): Promise<CurrentState<TEmbedding>>;

    /**
     * Gets an embedding state by key for an embedding specified by embedding identifier.
     * @template TEmbedding
     * @param {Constructor<T>} type The type of the embedding.
     * @param {Key | any} key The key of the embedding.
     * @param {EmbeddingId | Guid | string} embedding The id of the embedding.
     * @param {Cancellation} [cancellation] The cancellation token.
     * @returns {Promise<CurrentState<TEmbedding>>}
     */
    abstract get<TEmbedding> (type: Constructor<TEmbedding>, key: Key | any, embedding: EmbeddingId | Guid | string, cancellation?: Cancellation): Promise<CurrentState<TEmbedding>>;

    /**
     * Gets an embedding state by key for an embedding specified by embedding identifier.
     * @param {Key | any} key The key of the embedding.
     * @param {EmbeddingId | Guid | string} embedding The id of the embedding.
     * @param {Cancellation} [cancellation] The cancellation token.
     * @returns {Promise<CurrentState<any>>}
     */
    abstract get (key: Key | any, embedding: EmbeddingId | Guid | string, cancellation?: Cancellation): Promise<CurrentState<any>>;

    /**
     * Gets all embedding states for an embedding associated with a type.
     * @template T
     * @param {Constructor<T>} type The type of the embedding.
     * @param {Cancellation} [cancellation] The cancellation token.
     * @returns {Promise<CurrentState<TPRojection>>}
     */
    abstract getAll<TEmbedding> (type: Constructor<TEmbedding>, cancellation?: Cancellation): Promise<Map<Key, CurrentState<TEmbedding>>>;

    /**
     * Gets all embedding states for an embedding specified by embedding identifier.
     * @template TEmbedding
     * @param {Constructor<T>} type The type of the embedding.
     * @param {EmbeddingId | Guid | string} embedding The id of the embedding.
     * @param {Cancellation} [cancellation] The cancellation token.
     * @returns {Promise<CurrentState<TPRojection>>}
     */
    abstract getAll<TEmbedding> (type: Constructor<TEmbedding>, embedding: EmbeddingId | Guid | string, cancellation?: Cancellation): Promise<Map<Key, CurrentState<TEmbedding>>>;

    /**
     * Gets all embedding states for an embedding specified by embedding identifier.
     * @param {EmbeddingId | Guid | string} embedding The id of the embedding.
     * @param {Cancellation} [cancellation] The cancellation token.
     * @returns {Promise<Map<Key, CurrentState<any>>}
     */
    abstract getAll (embedding: EmbeddingId | Guid | string, cancellation?: Cancellation): Promise<Map<Key,CurrentState<any>>>;

    /**
     * Gets all the keys for an embedding associated with a type.
     * @template T
     * @param {Constructor<T>} type The type of the embedding.
     * @param {Cancellation} [cancellation] The cancellation token.
     * @returns {Promise<CurrentState<TPRojection>>}
     */
    abstract getKeys<TEmbedding> (type: Constructor<TEmbedding>, cancellation?: Cancellation): Promise<Key[]>;

    /**
     * Gets all the keys for an embedding specified by embedding identifier.
     * @template TEmbedding
     * @param {Constructor<T>} type The type of the embedding.
     * @param {EmbeddingId | Guid | string} embedding The id of the embedding.
     * @param {Cancellation} [cancellation] The cancellation token.
     * @returns {Promise<CurrentState<TPRojection>>}
     */
    abstract getKeys<TEmbedding> (type: Constructor<TEmbedding>, embedding: EmbeddingId | Guid | string, cancellation?: Cancellation): Promise<Key[]>;

    /**
     * Gets all the keys for an embedding specified by embedding identifier.
     * @param {EmbeddingId | Guid | string} embedding The id of the embedding.
     * @param {Cancellation} [cancellation] The cancellation token.
     * @returns {Promise<Key[]}
     */
    abstract getKeys (embedding: EmbeddingId | Guid | string, cancellation?: Cancellation): Promise<Key[]>;
}

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
export interface IEmbeddingStore {
    /**
     * Gets an embeddinging state by key for an embeddinging associated with a type.
     * @template TEmbedding
     * @param {Constructor<T>} type The type of the embedding.
     * @param {Key | any} key The key of the embedding.
     * @param {Cancellation} [cancellation] The cancellation token.
     * @returns {Promise<CurrentState<TEmbedding>>}
     */
    get<TEmbedding>(type: Constructor<TEmbedding>, key: Key | any, cancellation?: Cancellation): Promise<CurrentState<TEmbedding>>;

    /**
     * Gets an embeddinging state by key for an embeddinging specified by embedding identifier.
     * @template TEmbedding
     * @param {Constructor<T>} type The type of the embedding.
     * @param {Key | any} key The key of the embedding.
     * @param {EmbeddingId | Guid | string} embedding The id of the embedding.
     * @param {Cancellation} [cancellation] The cancellation token.
     * @returns {Promise<CurrentState<TEmbedding>>}
     */
    get<TEmbedding>(type: Constructor<TEmbedding>, key: Key | any, embedding: EmbeddingId | Guid | string, cancellation?: Cancellation): Promise<CurrentState<TEmbedding>>;

    /**
     * Gets an embeddinging state by key for an embeddinging specified by embedding identifier.
     * @param {Key | any} key The key of the embedding.
     * @param {EmbeddingId | Guid | string} embedding The id of the embedding.
     * @param {Cancellation} [cancellation] The cancellation token.
     * @returns {Promise<CurrentState<any>>}
     */
    get(key: Key | any, embedding: EmbeddingId | Guid | string, cancellation?: Cancellation): Promise<CurrentState<any>>;

    /**
     * Gets all embedding states for an embeddinging associated with a type.
     * @template T
     * @param {Constructor<T>} type The type of the embedding.
     * @param {Cancellation} [cancellation] The cancellation token.
     * @returns {Promise<CurrentState<TPRojection>>}
     */
    getAll<TEmbedding>(type: Constructor<TEmbedding>, cancellation?: Cancellation): Promise<Map<Key, CurrentState<TEmbedding>>>;

    /**
     * Gets all embedding states for an embeddinging specified by embedding identifier.
     * @template TEmbedding
     * @param {Constructor<T>} type The type of the embedding.
     * @param {EmbeddingId | Guid | string} embedding The id of the embedding.
     * @param {Cancellation} [cancellation] The cancellation token.
     * @returns {Promise<CurrentState<TPRojection>>}
     */
    getAll<TEmbedding>(type: Constructor<TEmbedding>, embedding: EmbeddingId | Guid | string, cancellation?: Cancellation): Promise<Map<Key, CurrentState<TEmbedding>>>;

    /**
     * Gets all embedding states for an embeddinging specified by embedding identifier.
     * @param {EmbeddingId | Guid | string} embedding The id of the embedding.
     * @param {Cancellation} [cancellation] The cancellation token.
     * @returns {Promise<Map<Key, CurrentState<any>>}
     */
    getAll(embedding: EmbeddingId | Guid | string, cancellation?: Cancellation): Promise<Map<Key,CurrentState<any>>>;

    /**
     * Gets all the keys for an embedding associated with a type.
     * @template T
     * @param {Constructor<T>} type The type of the embedding.
     * @param {Cancellation} [cancellation] The cancellation token.
     * @returns {Promise<CurrentState<TPRojection>>}
     */
    getKeys<TEmbedding>(type: Constructor<TEmbedding>, cancellation?: Cancellation): Promise<Key[]>;

    /**
     * Gets all the keys for an embedding specified by embedding identifier.
     * @template TEmbedding
     * @param {Constructor<T>} type The type of the embedding.
     * @param {EmbeddingId | Guid | string} embedding The id of the embedding.
     * @param {Cancellation} [cancellation] The cancellation token.
     * @returns {Promise<CurrentState<TPRojection>>}
     */
    getKeys<TEmbedding>(type: Constructor<TEmbedding>, embedding: EmbeddingId | Guid | string, cancellation?: Cancellation): Promise<Key[]>;

    /**
     * Gets all the keys for an embedding specified by embedding identifier.
     * @param {EmbeddingId | Guid | string} embedding The id of the embedding.
     * @param {Cancellation} [cancellation] The cancellation token.
     * @returns {Promise<Key[]}
     */
    getKeys(embedding: EmbeddingId | Guid | string, cancellation?: Cancellation): Promise<Key[]>;
}

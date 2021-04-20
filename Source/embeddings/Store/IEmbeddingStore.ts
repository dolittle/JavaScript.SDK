// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { ScopeId } from '@dolittle/sdk.events';
import { Cancellation } from '@dolittle/sdk.resilience';
import { Constructor } from '@dolittle/types';

import { Key, EmbeddingId } from '..';

import { CurrentState } from './CurrentState';

/**
 * Defines the API surface for getting embeddings.
 */
export interface IEmbeddingStore {
    /**
     * Gets a embedding state by key for a embedding associated with a type.
     * @template TEmbedding
     * @param {Constructor<T>} type The type of the embedding.
     * @param {Key | any} key The key of the embedding.
     * @param {Cancellation} [cancellation] The cancellation token.
     * @returns {Promise<CurrentState<TEmbedding>>}
     */
    get<TEmbedding>(type: Constructor<TEmbedding>, key: Key | any, cancellation?: Cancellation): Promise<CurrentState<TEmbedding>>;

    /**
     * Gets a embedding state by key for a embedding specified by embedding identifier.
     * @template TEmbedding
     * @param {Constructor<T>} type The type of the embedding.
     * @param {Key | any} key The key of the embedding.
     * @param {EmbeddingId | Guid | string} embedding The id of the embedding.
     * @param {Cancellation} [cancellation] The cancellation token.
     * @returns {Promise<CurrentState<TEmbedding>>}
     */
    get<TEmbedding>(type: Constructor<TEmbedding>, key: Key | any, embedding: EmbeddingId | Guid | string, cancellation?: Cancellation): Promise<CurrentState<TEmbedding>>;

    /**
     * Gets a embedding state by key for a embedding specified by embedding and scope identifier.
     * @template TEmbedding
     * @param {Constructor<T>} type The type of the embedding.
     * @param {Key | any} key The key of the embedding.
     * @param {EmbeddingId | Guid | string} embedding The id of the embedding.
     * @param {Cancellation} [cancellation] The cancellation token.
     * @returns {Promise<CurrentState<TEmbedding>>}
     */
    get<TEmbedding>(type: Constructor<TEmbedding>, key: Key | any, embedding: EmbeddingId | Guid | string, cancellation?: Cancellation): Promise<CurrentState<TEmbedding>>;

    /**
     * Gets a embedding state by key for a embedding specified by embedding identifier.
     * @param {Key | any} key The key of the embedding.
     * @param {EmbeddingId | Guid | string} embedding The id of the embedding.
     * @param {Cancellation} [cancellation] The cancellation token.
     * @returns {Promise<CurrentState<any>>}
     */
    get(key: Key | any, embedding: EmbeddingId | Guid | string, cancellation?: Cancellation): Promise<CurrentState<any>>;

    /**
     * Gets a embedding state by key for a embedding specified by embedding and scope identifier.
     * @param {Key | any} key The key of the embedding.
     * @param {EmbeddingId | Guid | string} embedding The id of the embedding.
     * @param {Cancellation} [cancellation] The cancellation token.
     * @returns {Promise<CurrentState<any>>}
     */
    get(key: Key | any, embedding: EmbeddingId | Guid | string, cancellation?: Cancellation): Promise<CurrentState<any>>;

    /**
     * Gets all embedding states for a embedding associated with a type.
     * @template T
     * @param {Constructor<T>} type The type of the embedding.
     * @param {Cancellation} [cancellation] The cancellation token.
     * @returns {Promise<CurrentState<TPRojection>>}
     */
    getAll<TEmbedding>(type: Constructor<TEmbedding>, cancellation?: Cancellation): Promise<Map<Key, CurrentState<TEmbedding>>>;

    /**
     * Gets all embedding states for a embedding specified by embedding identifier.
     * @template TEmbedding
     * @param {Constructor<T>} type The type of the embedding.
     * @param {EmbeddingId | Guid | string} embedding The id of the embedding.
     * @param {Cancellation} [cancellation] The cancellation token.
     * @returns {Promise<CurrentState<TPRojection>>}
     */
    getAll<TEmbedding>(type: Constructor<TEmbedding>, embedding: EmbeddingId | Guid | string, cancellation?: Cancellation): Promise<Map<Key, CurrentState<TEmbedding>>>;

    /**
     * Gets all embedding states for a embedding specified by embedding and scope identifier.
     * @template TEmbedding
     * @param {Constructor<T>} type The type of the embedding.
     * @param {EmbeddingId | Guid | string} embedding The id of the embedding.
     * @param {Cancellation} [cancellation] The cancellation token.
     * @returns {Promise<Map<Key, CurrentState<TEmbedding>>}
     */
    getAll<TEmbedding>(type: Constructor<TEmbedding>, embedding: EmbeddingId | Guid | string, cancellation?: Cancellation): Promise<Map<Key, CurrentState<TEmbedding>>>;

    /**
     * Gets all embedding states for a embedding specified by embedding identifier.
     * @param {EmbeddingId | Guid | string} embedding The id of the embedding.
     * @param {Cancellation} [cancellation] The cancellation token.
     * @returns {Promise<Map<Key, CurrentState<any>>}
     */
    getAll(embedding: EmbeddingId | Guid | string, cancellation?: Cancellation): Promise<Map<Key,CurrentState<any>>>;

    /**
     * Gets all embedding states for a embedding specified by embedding and scope identifier.
     * @param {EmbeddingId | Guid | string} embedding The id of the embedding.
     * @param {Cancellation} [cancellation] The cancellation token.
     * @returns {Promise<Map<Key, CurrentState<any>>}
     */
    getAll(embedding: EmbeddingId | Guid | string, cancellation?: Cancellation): Promise<Map<Key, CurrentState<any>>>;
}

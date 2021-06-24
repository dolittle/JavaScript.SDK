// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { EmbeddingId, EmbeddingStore } from '@dolittle/sdk.embeddings';
import { CurrentState, Key } from '@dolittle/sdk.projections';
import { Cancellation } from '@dolittle/sdk.resilience';
import { Constructor } from '@dolittle/types';
import { IEmbeddingStore } from './Store';

/**
 * Defines a system for working with an embedding.
 */
export abstract class IEmbedding extends EmbeddingStore {
    /**
     * Updates an embedding state by key for the embedding associated with a type.
     * @template TEmbedding
     * @param {Constructor<T>} type The type of the embedding.
     * @param {Key | string} key The key of the embedding.
     * @param {TEmbedding} state The updated state of the embedding.
     * @param {Cancellation} [cancellation] The cancellation token.
     * @returns {Promise<CurrentState<TEmbedding>>}
     */
    abstract update<TEmbedding> (
        type: Constructor<TEmbedding>,
        key: Key | string,
        state: TEmbedding,
        cancellation?: Cancellation): Promise<CurrentState<TEmbedding>>;

    /**
     * Updates an embedding state by key for the embedding specified by embedding identifier.
     * @template TEmbedding
     * @param {Constructor<TEmbedding>} type The type of the embedding.
     * @param {Key | string} key The key of the embedding.
     * @param {EmbeddingId | Guid | string} embeddingId The id of the embedding.
     * @param {TEmbedding} state The updated state of the embedding.
     * @param {Cancellation} [cancellation] The cancellation token.
     * @returns {Promise<CurrentState<TEmbedding>>}
     */
    abstract update<TEmbedding> (
        type: Constructor<TEmbedding>,
        key: Key | string,
        embeddingId: EmbeddingId | Guid | string,
        state: TEmbedding,
        cancellation?: Cancellation): Promise<CurrentState<TEmbedding>>;

    /**
     * Updates an embedding state by key for the embedding specified by embedding identifier.
     * @param {Key | string} key The key of the embedding.
     * @param {EmbeddingId | Guid | string} embeddingId The id of the embedding.
     * @param {any} state The updated state of the embedding.
     * @param {Cancellation} [cancellation] The cancellation token.
     * @returns {Promise<CurrentState<any>>}
     */
    abstract update (
        key: Key | string,
        embeddingId: EmbeddingId | Guid | string,
        state: any,
        cancellation?: Cancellation): Promise<CurrentState<any>>;

    /**
     * Deletes an embedding state by key for the embedding associated with a type.
     * @template TEmbedding
     * @param {Constructor<T>} type The type of the embedding.
     * @param {Key | string} key The key of the embedding.
     * @param {Cancellation} [cancellation] The cancellation token.
     * @returns {Promise<void>}
     */
    abstract delete<TEmbedding> (
        type: Constructor<TEmbedding>,
        key: Key | string,
        cancellation?: Cancellation): Promise<void>;

    /**
     * Deletes an embedding state by key for the embedding specified by the embedding identifier.
     * @param {Key | string} key The key of the embedding.
     * @param {EmbeddingId | Guid | string} embeddingId The id of the embedding.
     * @param {Cancellation} [cancellation] The cancellation token.
     * @returns {Promise<void>}
     */
    abstract delete (
        key: Key | string,
        embeddingId: EmbeddingId | Guid | string,
        cancellation?: Cancellation): Promise<void>;
}

// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { CurrentState, Key } from '@dolittle/sdk.projections';
import { Cancellation } from '@dolittle/sdk.resilience';
import { Constructor } from '@dolittle/types';

import { EmbeddingId } from './EmbeddingId';
import { EmbeddingStore } from './Store';

/**
 * Defines a system for working with an embedding.
 */
export abstract class IEmbedding extends EmbeddingStore {
    /**
     * Updates an embedding state by key by calling the compare method for the embedding associated with a type.
     * It will keep calling the compare method to commit events until the embedding reaches the desired state.
     * @param {Constructor<TEmbedding>} type - The type of the embedding.
     * @param {Key | string} key - The key of the embedding.
     * @param {TEmbedding} state - The desired state of the embedding.
     * @param {Cancellation} [cancellation] - The cancellation token.
     * @returns {Promise<CurrentState<TEmbedding>>} The updated state. If no events were committed by the compare method, it will instead return the state passed into the call.
     * @template TEmbedding The type of the embedding.
     */
    abstract update<TEmbedding>(
        type: Constructor<TEmbedding>,
        key: Key | string,
        state: TEmbedding,
        cancellation?: Cancellation): Promise<CurrentState<TEmbedding>>;

    /**
     * Updates an embedding state by key by calling the compare method for the embedding specified by embedding identifier.
     * It will keep calling the compare method to commit events until the embedding reaches the desired state.
     * @param {Constructor<TEmbedding>} type - The type of the embedding.
     * @param {Key | string} key - The key of the embedding.
     * @param {EmbeddingId | Guid | string} embeddingId - The id of the embedding.
     * @param {TEmbedding} state - The desired state of the embedding.
     * @param {Cancellation} [cancellation] - The cancellation token.
     * @returns {Promise<CurrentState<TEmbedding>>} The updated state. If no events were committed by the compare method, it will instead return the state passed into the call.
     * @template TEmbedding The type of the embedding.
     */
    abstract update<TEmbedding>(
        type: Constructor<TEmbedding>,
        key: Key | string,
        embeddingId: EmbeddingId | Guid | string,
        state: TEmbedding,
        cancellation?: Cancellation): Promise<CurrentState<TEmbedding>>;

    /**
     * Updates an embedding state by key by calling the compare method for the embedding specified by embedding identifier.
     * It will keep calling the compare method to commit events until the embedding reaches the desired state.
     * @param {Key | string} key - The key of the embedding.
     * @param {EmbeddingId | Guid | string} embeddingId - The id of the embedding.
     * @param {any} state - The desired state of the embedding.
     * @param {Cancellation} [cancellation] - The cancellation token.
     * @returns {Promise<CurrentState<any>>} The updated state. If no events were committed by the compare method, it will instead return the state passed into the call.
     */
    abstract update(
        key: Key | string,
        embeddingId: EmbeddingId | Guid | string,
        state: any,
        cancellation?: Cancellation): Promise<CurrentState<any>>;

    /**
     * Removes an embedding state by key for the embedding associated with a type.
     * @param {Constructor<TEmbedding>} type - The type of the embedding.
     * @param {Key | string} key - The key of the embedding.
     * @param {Cancellation} [cancellation] - The cancellation token.
     * @returns {Promise<void>}
     * @template TEmbedding The type of the embedding.
     */
    abstract delete<TEmbedding>(
        type: Constructor<TEmbedding>,
        key: Key | string,
        cancellation?: Cancellation): Promise<void>;

    /**
     * Removes an embedding state by key for the embedding specified by the embedding identifier.
     * @param {Key | string} key - The key of the embedding.
     * @param {EmbeddingId | Guid | string} embeddingId - The id of the embedding.
     * @param {Cancellation} [cancellation] - The cancellation token.
     * @returns {Promise<void>}
     */
    abstract delete(
        key: Key | string,
        embeddingId: EmbeddingId | Guid | string,
        cancellation?: Cancellation): Promise<void>;
}

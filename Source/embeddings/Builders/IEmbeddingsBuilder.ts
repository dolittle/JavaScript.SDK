// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

import { EmbeddingId } from '../EmbeddingId';
import { IEmbeddingBuilder } from './IEmbeddingBuilder';

/**
 * Represents a builder for building embeddings.
 */
export abstract class IEmbeddingsBuilder {
    /**
     * Start building an embedding.
     * @param {EmbeddingId | Guid | string} embeddingId - The unique identifier of the embedding.
     * @returns {IEmbeddingBuilder} The builder for continuation.
     */
    abstract createEmbedding(embeddingId: EmbeddingId | Guid | string): IEmbeddingBuilder;

    /**
     * Register a type as an embedding.
     * @param type - The type to register as a embedding.
     * @returns {IEmbeddingsBuilder} The builder for continuation.
     */
     abstract registerEmbedding<T>(type: Constructor<T>): IEmbeddingsBuilder;
}

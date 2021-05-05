// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Cancellation } from '@dolittle/sdk.resilience';

import { EmbeddingProcessor } from './Internal';

/**
 * Defines a system for registering embeddings.
 */
export interface IEmbeddings {

    /**
     * Register an embedding.
     * @template T Type of the readmodel.
     * @param {EmbeddingProcessor} embeddingProcessor Embedding processor to register.
     * @param {Cancellation} cancellation Used to close the connection to the Runtime.
     */
    register<T>(embeddingProcessor: EmbeddingProcessor<T>, cancellation?: Cancellation): void;
}

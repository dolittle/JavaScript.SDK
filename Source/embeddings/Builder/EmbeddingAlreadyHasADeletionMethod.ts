// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';
import { EmbeddingId } from '../EmbeddingId';

/**
 * Exception that gets thrown when attempting to have another deletion method on an embedding.
 */
export class EmbeddingAlreadyHasADeletionMethod extends Exception {
    /**
     * Creates an instance of EmbeddingAlreadyHasADeletionMethod
     * @param {EmbeddingId} embedding The embedding that already has a deletion method.
     */
    constructor(embedding: EmbeddingId) {
        super(`Embedding ${embedding} already has a deletion method defined.`);
    }
}

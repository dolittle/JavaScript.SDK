// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';
import { EmbeddingId } from '../EmbeddingId';

/**
 * Exception that gets thrown when attempting to have another remove method on an embedding.
 */
export class EmbeddingAlreadyHasARemoveMethod extends Exception {
    /**
     * Creates an instance of EmbeddingAlreadyHasARemoveMethod
     * @param {EmbeddingId} embedding The embedding that already has a remove method.
     */
    constructor(embedding: EmbeddingId) {
        super(`Embedding ${embedding} already has a remove method defined.`);
    }
}

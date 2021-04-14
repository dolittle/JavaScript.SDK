// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';
import { EmbeddingId } from '../EmbeddingId';

/**
 * Exception that gets thrown when attempting to have another compare method on an embedding.
 */
export class EmbeddingAlreadyHasACompareMethod extends Exception {
    /**
     * Creates an instance of EmbeddingAlreadyHasACompareMethod
     * @param {EmbeddingId} embedding The embedding that already has a compare method.
     */
    constructor(embedding: EmbeddingId) {
        super(`Embedding ${embedding} already has a compare method defined.`);
    }
}

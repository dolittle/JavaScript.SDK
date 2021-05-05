// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';
import { EmbeddingId } from '../EmbeddingId';

/**
 * Exception that gets thrown when attempting to have another delete method on an embedding.
 */
export class EmbeddingAlreadyHasADeleteMethod extends Exception {
    /**
     * Creates an instance of EmbeddingAlreadyHasADeleteMethod
     * @param {EmbeddingId} embedding The embedding that already has a delete method.
     */
    constructor(embedding: EmbeddingId) {
        super(`Embedding ${embedding} already has a delete method defined.`);
    }
}

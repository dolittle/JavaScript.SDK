// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';
import { Key } from '@dolittle/sdk.projections';
import { EmbeddingId } from '..';

/**
 * Exception that gets thrown when embedding state fails to be getted.
 */
export class FailedToGetEmbeddingState extends Exception {
    /**
     * Initialises an instance of {@link FailedToGetEmbeddingState}.
     * @param {EmbeddingId} embedding - The embedding identifier.
     * @param {Key} key - The projection key.
     */
    constructor(embedding: EmbeddingId, key: Key) {
        super(`Failed to get embedding ${embedding} with key ${key}. No state returned for embedding.`);
    }
}

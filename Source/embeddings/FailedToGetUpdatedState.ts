// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';
import { Key } from '@dolittle/sdk.projections';
import { EmbeddingId } from './EmbeddingId';

/**
 * An exception that gets thrown when an embedding update response does not have the updated state.
 */
export class FailedToGetUpdatedState extends Exception {
    /**
     * Initialises an instance of {@link FailedToGetUpdatedState}.
     * @param {EmbeddingId} embedding - The embedding identifier.
     * @param {Key | undefined} key - The optional key.
     */
    constructor(embedding: EmbeddingId, key: Key | undefined) {
        super(`Failed to get updated embedding state for embedding ${embedding} ${key ? `with key ${key} `: ''}`);
    }
}

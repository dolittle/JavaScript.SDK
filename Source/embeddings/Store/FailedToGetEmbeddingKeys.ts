// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';
import { Failure } from '@dolittle/sdk.protobuf';
import { EmbeddingId } from '..';

/**
 * An exception that gets thrown when an embedding fails to be getted.
 */
export class FailedToGetEmbeddingKeys extends Exception {
    /**
     * Initialises an instance of {@link FailedToGetEmbeddingKeys}.
     * @param {EmbeddingId} embedding The embedding identifier.
     * @param {Failure} failure The failure.
     */
    constructor(embedding: EmbeddingId, failure: Failure) {
        super(`Failed to get the keys for embedding ${embedding} due to failure ${failure.id} with reason: ${failure.reason}`);
    }
}

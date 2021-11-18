// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';
import { Key } from '@dolittle/sdk.projections';
import { Failure } from '@dolittle/sdk.protobuf';
import { EmbeddingId } from './EmbeddingId';

/**
 * An exception that gets thrown when an embedding fails to be updated.
 */
export class FailedToUpdate extends Exception {
    /**
     * Initialises an instance of {@link FailedToUpdate}.
     * @param {EmbeddingId} embedding - The embedding identifier.
     * @param {Key | undefined} key - The optional key.
     * @param {Failure} failure - The failure.
     */
    constructor(embedding: EmbeddingId, key: Key | undefined, failure: Failure) {
        super(`Failed to update embedding ${embedding} ${key ? `with key ${key} `: ''} due to failure ${failure.id} with reason: ${failure.reason}`);
    }
}

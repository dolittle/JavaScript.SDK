// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';
import { ScopeId } from '@dolittle/sdk.events';
import { Failure } from '@dolittle/sdk.protobuf';
import { Key } from '@dolittle/sdk.projections';
import { EmbeddingId } from '..';

/**
 * An exception that gets thrown when an embedding fails to be getted.
 */
export class FailedToGetEmbedding extends Exception {
    /**
     * Initialises an instance of {@link FailedToGetEmbedding}.
     * @param {EmbeddingId} embedding The embedding identifier.
     * @param {Key | undefined} key The optional key.
     * @param {Failure} failure The failure.
     */ 
    constructor(embedding: EmbeddingId, key: Key | undefined, failure: Failure) {
        super(`Failed to get embedding ${embedding} ${key ? `with key ${key}  `: ""}due to failure ${failure.id} with reason: ${failure.reason}`);
    }
}

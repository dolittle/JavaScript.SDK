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
    constructor(embedding: EmbeddingId, key: Key | undefined, failure: Failure) {
        if (key) {
            super(`Failed to get embedding ${embedding} with key ${key} due to failure ${failure.id} with reason: ${failure.reason}`);
        } else {
            super(`Failed to get embedding ${embedding} due to failure ${failure.id} with reason: ${failure.reason}`);
        }
    }
}

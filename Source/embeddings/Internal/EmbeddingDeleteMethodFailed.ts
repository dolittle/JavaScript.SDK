// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';
import { EmbeddingContext, EmbeddingId } from '@dolittle/sdk.embeddings';

export class EmbeddingDeleteMethodFailed<T> extends Exception {
    /**
     * Initializes a new instance of {@link EmbeddingDeleteMethodFailed}.
     * @param {EmbeddingId} embeddingId
     * @param {T} receivedState
     * @param {T} currentState
     * @param {EmbeddingContext} context
     * @param {any} error
     */
     constructor(embeddingId: EmbeddingId, currentState: T, context: EmbeddingContext, error: any) {
        super(`The delete method on embedding ${embeddingId} failed to delete key ${context.key}. Current state: ${JSON.stringify(currentState)}. The error was: ${error}`);
    }
}

// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';
import { EmbeddingContext, EmbeddingId } from '@dolittle/sdk.embeddings';

/**
 *
 */
export class EmbeddingUpdateMethodFailed<T> extends Exception {

    /**
     * Initializes a new instance of {@link EmbeddingUpdateMethodFailed}.
     * @param {EmbeddingId} embeddingId
     * @param {T} receivedState
     * @param {T} currentState
     * @param {EmbeddingContext} context
     * @param {Error} error
     */
    constructor(embeddingId: EmbeddingId, receivedState: T, currentState: T, context: EmbeddingContext, error: any) {
        super(`The update method on embedding ${embeddingId} failed to update read model with key ${context.key}. Received state: ${JSON.stringify(receivedState)}. Current state: ${JSON.stringify(currentState)}The error was: ${error}`);
    }
}

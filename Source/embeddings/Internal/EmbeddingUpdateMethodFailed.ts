// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';

import { EmbeddingContext } from '../EmbeddingContext';
import { EmbeddingId } from '../EmbeddingId';

/**
 * Exception that gets thrown when calling update on an embedding fails.
 * @template TReadModel The type of the embedding read model.
 */
export class EmbeddingUpdateMethodFailed<TReadModel> extends Exception {

    /**
     * Initializes a new instance of the {@link EmbeddingUpdateMethodFailed} class.
     * @param {EmbeddingId} embeddingId - The embedding identifier.
     * @param {TReadModel} receivedState - The state received by the update call.
     * @param {TReadModel} currentState - The current state of the embedding.
     * @param {EmbeddingContext} context - The embedding context.
     * @param {Error} error - The error that occured.
     */
    constructor(embeddingId: EmbeddingId, receivedState: TReadModel, currentState: TReadModel, context: EmbeddingContext, error: any) {
        super(`The update method on embedding ${embeddingId} failed to update read model with key ${context.key}. Received state: ${JSON.stringify(receivedState)}. Current state: ${JSON.stringify(currentState)} The error was: ${error}`);
    }
}

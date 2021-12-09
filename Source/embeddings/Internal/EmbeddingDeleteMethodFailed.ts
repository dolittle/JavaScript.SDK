// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';

import { EmbeddingContext, EmbeddingId } from '..';

/**
 * Exception that gets thrown when calling delete on an embedding fails.
 * @template TReadModel The type of the embedding read model.
 */
export class EmbeddingDeleteMethodFailed<TReadModel> extends Exception {
    /**
     * Initializes a new instance of the {@link EmbeddingDeleteMethodFailed} class.
     * @param {EmbeddingId} embeddingId - The embedding identifier.
     * @param {TReadModel} currentState - The current state of the embedding.
     * @param {EmbeddingContext} context - The embedding context.
     * @param {Error} error - The error that occured.
     */
     constructor(embeddingId: EmbeddingId, currentState: TReadModel, context: EmbeddingContext, error: any) {
        super(`The delete method on embedding ${embeddingId} failed to delete key ${context.key}. Current state: ${JSON.stringify(currentState)}. The error was: ${error}`);
    }
}

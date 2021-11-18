// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Cancellation, retryPipe } from '@dolittle/sdk.resilience';
import { delay } from 'rxjs/operators';
import { Logger } from 'winston';
import { IEmbeddings } from './IEmbeddings';
import { EmbeddingProcessor } from './EmbeddingProcessor';

/**
 * Represents an implementation of {IEmbeddings}.
 */
export class Embeddings implements IEmbeddings {

    /**
     * Initializes an instance of {@link Embeddings}.
     * @param {Logger} _logger - For logging.
     */
    constructor(private readonly _logger: Logger) {
    }

    /** @inheritdoc */
    register<T>(embeddingProcessor: EmbeddingProcessor<T>, cancellation: Cancellation = Cancellation.default): void {
        embeddingProcessor
            .registerForeverWithPolicy(retryPipe(delay(1000)), cancellation)
            .subscribe({
                error: (error: Error) => {
                    this._logger.error(`Failed to register embedding: ${error}`);
                },
                complete: () => {
                    this._logger.error(`Embedding registration completed.`);
                }
            });
    }
}

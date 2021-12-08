// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';
import { delay } from 'rxjs/operators';

import { ITenantServiceProviders } from '@dolittle/sdk.common/DependencyInversion';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { Cancellation, retryPipe } from '@dolittle/sdk.resilience';

import { EmbeddingsClient } from '@dolittle/runtime.contracts/Embeddings/Embeddings_grpc_pb';

import { IEmbeddings } from './IEmbeddings';
import { EmbeddingProcessor } from './EmbeddingProcessor';

/**
 * Represents an implementation of {IEmbeddings}.
 */
export class Embeddings extends IEmbeddings {

    /**
     * Initializes an instance of {@link Embeddings}.
     * @param {EmbeddingsClient} _client - The embeddings client to use.
     * @param {ExecutionContext} _executionContext - The base execution context of the client.
     * @param {ITenantServiceProviders} _services - For resolving services while handling requests.
     * @param {Logger} _logger - For logging.
     */
    constructor(
        private readonly _client: EmbeddingsClient,
        private readonly _executionContext: ExecutionContext,
        private readonly _services: ITenantServiceProviders,
        private readonly _logger: Logger
    ) {
        super();
    }

    /** @inheritdoc */
    register<T>(embeddingProcessor: EmbeddingProcessor<T>, cancellation: Cancellation = Cancellation.default): void {
        embeddingProcessor.registerForeverWithPolicy(
            retryPipe(delay(1000)),
            this._client,
            this._executionContext,
            this._services,
            this._logger,
            cancellation)
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

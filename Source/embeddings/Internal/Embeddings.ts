// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';
import { delay } from 'rxjs/operators';

import { ITenantServiceProviders } from '@dolittle/sdk.dependencyinversion';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { Cancellation, RetryCancelled, retryPipe } from '@dolittle/sdk.resilience';
import { ITrackProcessors } from '@dolittle/sdk.services';

import { EmbeddingsClient } from '@dolittle/contracts/Runtime/Embeddings/Embeddings_grpc_pb';

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
     * @param {ITrackProcessors} _tracker - The tracker to register the started processors with.
     * @param {Logger} _logger - For logging.
     * @param {number} _pingInterval - The ping interval to configure the reverse call client with.
     */
    constructor(
        private readonly _client: EmbeddingsClient,
        private readonly _executionContext: ExecutionContext,
        private readonly _services: ITenantServiceProviders,
        private readonly _tracker: ITrackProcessors,
        private readonly _logger: Logger,
        private readonly _pingInterval: number,
    ) {
        super();
    }

    /** @inheritdoc */
    register<T>(embeddingProcessor: EmbeddingProcessor<T>, cancellation: Cancellation = Cancellation.default): void {
        this._tracker.registerProcessor(
            embeddingProcessor.registerForeverWithPolicy(
                retryPipe(delay(1000)),
                this._client,
                this._executionContext,
                this._services,
                this._logger,
                this._pingInterval,
                cancellation)
            .subscribe({
                error: (error: Error) => {
                    if (error instanceof RetryCancelled) return;
                    this._logger.error(`Failed to register embedding: ${error}`);
                },
                complete: () => {
                    this._logger.error(`Embedding registration completed.`);
                }
            }));
    }
}

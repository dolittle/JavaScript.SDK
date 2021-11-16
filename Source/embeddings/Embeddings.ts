// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { EmbeddingsClient } from '@dolittle/runtime.contracts/Embeddings/Embeddings_grpc_pb';
import { EmbeddingStoreClient } from '@dolittle/runtime.contracts/Embeddings/Store_grpc_pb';
import { ExecutionContext, TenantIdLike } from '@dolittle/sdk.execution';
import { IProjectionAssociations, ProjectionsToSDKConverter } from '@dolittle/sdk.projections';
import { Logger } from 'winston';
import { Embedding } from './Embedding';
import { IEmbedding } from './IEmbedding';
import { IEmbeddings } from './IEmbeddings';
import { EmbeddingStoreBuilder } from './Store';

/**
 * Represents an implementation of {@link IEmbeddings}.
 */
export class Embeddings extends IEmbeddings {
    /**
     * Initializes an instance of {@link EmbeddingStoreBuilder}.
     * @param {EmbeddingStoreClient} _embeddingsStoreClient - The embedding store client.
     * @param _embeddingsClient
     * @param {ExecutionContext} _executionContext - The execution context.
     * @param {IProjectionAssociations} _embeddingAssociations - The embedding associations.
     * @param {Logger} _logger - The logger.
     */
    constructor(
        private readonly _embeddingsStoreClient: EmbeddingStoreClient,
        private readonly _embeddingsClient: EmbeddingsClient,
        private readonly _executionContext: ExecutionContext,
        private readonly _embeddingAssociations: IProjectionAssociations,
        private readonly _logger: Logger) {
            super();
    }

    /** @inheritdoc */
    forTenant(tenantId: TenantIdLike): IEmbedding {
        const executionContext = this._executionContext
            .forTenant(tenantId)
            .forCorrelation(Guid.create());

        const embeddingStore = new EmbeddingStoreBuilder(
            this._embeddingsStoreClient,
            this._executionContext,
            this._embeddingAssociations,
            this._logger);

        return new Embedding(
            this._embeddingsStoreClient,
            executionContext,
            new ProjectionsToSDKConverter(),
            this._embeddingAssociations,
            this._embeddingsClient,
            this._logger);
    }
}

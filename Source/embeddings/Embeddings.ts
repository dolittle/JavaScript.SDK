// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';
import { Guid } from '@dolittle/rudiments';

import { ExecutionContext, TenantIdLike } from '@dolittle/sdk.execution';
import { ProjectionsToSDKConverter } from '@dolittle/sdk.projections';

import { EmbeddingsClient } from '@dolittle/runtime.contracts/Embeddings/Embeddings_grpc_pb';
import { EmbeddingStoreClient } from '@dolittle/runtime.contracts/Embeddings/Store_grpc_pb';

import { IEmbeddingReadModelTypes } from './Store/IEmbeddingReadModelTypes';
import { IEmbedding } from './IEmbedding';
import { IEmbeddings } from './IEmbeddings';
import { Embedding } from './Embedding';

/**
 * Represents an implementation of {@link IEmbeddings}.
 */
export class Embeddings extends IEmbeddings {
    /**
     * Initializes an instance of {@link EmbeddingStoreBuilder}.
     * @param {EmbeddingStoreClient} _embeddingsStoreClient - The embedding store client.
     * @param {EmbeddingsClient} _embeddingsClient - The embeddings client.
     * @param {ExecutionContext} _executionContext - The execution context.
     * @param {IEmbeddingReadModelTypes} _readModelTypes - The embedding associations.
     * @param {Logger} _logger - The logger.
     */
    constructor(
        private readonly _embeddingsStoreClient: EmbeddingStoreClient,
        private readonly _embeddingsClient: EmbeddingsClient,
        private readonly _executionContext: ExecutionContext,
        private readonly _readModelTypes: IEmbeddingReadModelTypes,
        private readonly _logger: Logger) {
            super();
    }

    /** @inheritdoc */
    forTenant(tenantId: TenantIdLike): IEmbedding {
        const executionContext = this._executionContext
            .forTenant(tenantId)
            .forCorrelation(Guid.create());

        return new Embedding(
            this._embeddingsStoreClient,
            executionContext,
            new ProjectionsToSDKConverter(),
            this._readModelTypes,
            this._embeddingsClient,
            this._logger);
    }
}

// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';

import { Guid } from '@dolittle/rudiments';

import { ExecutionContext, TenantId } from '@dolittle/sdk.execution';
import { IProjectionAssociations, ProjectionsToSDKConverter } from '@dolittle/sdk.projections';

import { EmbeddingStoreClient } from '@dolittle/runtime.contracts/Embeddings/Store_grpc_pb';

import { EmbeddingStore } from '../EmbeddingStore';
import { IEmbeddingStore } from '../IEmbeddingStore';

/**
 * Represents a builder for building an embedding store.
 */
export class EmbeddingStoreBuilder {

    /**
     * Initializes an instance of {@link EmbeddingStoreBuilder}.
     * @param {EmbeddingStoreClient} _embeddingsStoreClient - The embedding store client.
     * @param {ExecutionContext} _executionContext - The execution context.
     * @param {IProjectionAssociations} _embeddingAssociations - The embedding associations.
     * @param {Logger} _logger - The logger.
     */
    constructor(
        private readonly _embeddingsStoreClient: EmbeddingStoreClient,
        private readonly _executionContext: ExecutionContext,
        private readonly _embeddingAssociations: IProjectionAssociations,
        private readonly _logger: Logger) {
    }

    /**
     * Build an {@link IEmbeddingStore} for the given tenant.
     * @param {TenantId | Guid | string} tenantId - The tenant id.
     * @returns {IEmbeddingStore} The embedding store.
     */
    forTenant(tenantId: TenantId | Guid | string): IEmbeddingStore {
        const executionContext = this._executionContext
            .forTenant(tenantId)
            .forCorrelation(Guid.create());

        return new EmbeddingStore(
            this._embeddingsStoreClient,
            executionContext,
            new ProjectionsToSDKConverter(),
            this._embeddingAssociations,
            this._logger);
    }
}

// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';

import { ExecutionContext, TenantId } from '@dolittle/sdk.execution';
import { Guid } from '@dolittle/rudiments';

import { EmbeddingsClient } from '@dolittle/runtime.contracts/Embeddings/Store_grpc_pb';

import { IEmbeddingAssociations, IEmbeddingStore, EmbeddingStore } from '..';

/**
 * Represents a builder for builing a embedding store.
 */
export class EmbeddingStoreBuilder {

    constructor(
        private readonly _embeddingsClient: EmbeddingsClient,
        private readonly _executionContext: ExecutionContext,
        private readonly _embeddingAssociations: IEmbeddingAssociations,
        private readonly _logger: Logger) {
    }

    /**
     * Build an {@link IEmbeddingStore} for the given tenant.
     * @param {TenantId | Guid | string} tenantId The tenant id.
     * @returns {IEmbeddingStore} The embedding store.
     */
    forTenant(tenantId: TenantId | Guid | string): IEmbeddingStore {
        const executionContext = this._executionContext
            .forTenant(tenantId)
            .forCorrelation(Guid.create());

        return new EmbeddingStore(
            this._embeddingsClient,
            executionContext,
            this._embeddingAssociations,
            this._logger);
    }
}

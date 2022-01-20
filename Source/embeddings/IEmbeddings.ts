// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { TenantIdLike } from '@dolittle/sdk.execution';

import { IEmbedding } from './IEmbedding';

/**
 * Defines a builder for {@link IEmbedding}.
 */
export abstract class IEmbeddings {
    /**
     * Build an {@link IEmbedding} for the given tenant.
     * @param {TenantIdLike} tenantId - The tenant id.
     * @returns {IEmbedding} The embedding.
     */
    abstract forTenant(tenantId: TenantIdLike): IEmbedding;
}

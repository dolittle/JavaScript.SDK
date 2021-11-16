// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { TenantIdLike } from '@dolittle/sdk.execution';
import { IProjectionStore } from '..';

/**
 * Defines a builder for {@link IProjectionStore}.
 */

export abstract class IProjectionStoreBuilder {
    /**
     * Build an {@link IProjectionStore} for the given tenant.
     * @param { TenantIdLike } tenantId The tenant id.
     * @returns {IProjectionStore} The projection store.
     */
    abstract forTenant(tenantId: TenantIdLike): IProjectionStore;
}

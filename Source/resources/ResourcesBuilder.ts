// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { TenantId } from '@dolittle/sdk.execution';

import { IResources } from './IResources';
import { IResourcesBuilder } from './IResourcesBuilder';
import { ResourcesNotFetchedForTenant } from './ResourcesNotFetchedForTenant';

/**
 * Defines a system that knows about Resources provided by the Runtime.
 */
export class ResourcesBuilder extends IResourcesBuilder {
    /**
     * Initialises a new instance of the {@link ResourcesBuilder} class.
     * @param {Map<TenantId, IResources>} _tenantResources - The fetched resources per tenant.
     */
    constructor(private readonly _tenantResources: Map<TenantId, IResources>) {
        super();
    }

    /** @inheritdoc */
    forTenant(tenant: TenantId): IResources {
        if (!this._tenantResources.has(tenant)) {
            throw new ResourcesNotFetchedForTenant(tenant);
        }

        return this._tenantResources.get(tenant)!;
    }
}

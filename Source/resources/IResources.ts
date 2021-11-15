// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
import { TenantId } from '@dolittle/sdk.execution';
import { IResourcesForTenant } from './IResourcesForTenant';

/**
 * Defines a system that knows about Resources provided by the Runtime.
 */
export abstract class IResources {
    /**
     * Gets the the {@link IResourcesForTenant} resources for a specific tenant.
     * @param {TenantId} tenant The Tenant to get the {@link IResourcesForTenant} for
     */
    abstract forTenant(tenant: TenantId): IResourcesForTenant;
}

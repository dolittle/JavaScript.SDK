// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { TenantId } from '@dolittle/sdk.execution';
import { IResources } from './IResources';

/**
 * Defines a system that knows about Resources provided by the Runtime.
 */
export abstract class IResourcesBuilder {
    /**
     * Gets the the {@link IResources} resources for a specific tenant.
     * @param {TenantId} tenant - The Tenant to get the {@link IResources} for.
     */
    abstract forTenant(tenant: TenantId): IResources;
}

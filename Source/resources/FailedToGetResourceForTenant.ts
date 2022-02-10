// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';
import { TenantId } from '@dolittle/sdk.execution';

import { ResourceName } from './ResourceName';

/**
 * Exception that gets thrown when getting a resource for a tenant failed.
 */
export class FailedToGetResourceForTenant extends Exception {
    /**
     * Initializes a new instance of the {@link FailedToGetResourceForTenant} class.
     * @param {ResourceName} resource - The resource name that was attempted to get.
     * @param {TenantId} tenant - The tenant that the resource was attempted to get for.
     * @param {string} reason - The reason for the failure.
     */
    constructor(resource: ResourceName, tenant: TenantId, reason: string) {
        super(`Failed to get resource ${resource} for tenant ${tenant} because ${reason}`);
    }
}

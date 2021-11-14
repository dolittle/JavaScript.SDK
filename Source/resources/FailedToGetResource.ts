// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
import { Exception } from '@dolittle/rudiments';
import { TenantId } from '@dolittle/sdk.execution';
import { IResource } from './IResource';
import { ResourceName } from './ResourceName';

/**
 * Exception that gets thrown when getting a resource for a tenant failed.
 */

export class FailedToGetResource extends Exception {

    /**
     * Initializes a new instance of the {@link FailedToGetResource} class.
     * @param failureReason The reason for the failure.
     */
    constructor(resourceName: ResourceName, tenant: TenantId, reason: string) {
        super(`Failed to get resource ${resourceName.value} for tenant ${tenant.value} because ${reason}`);
    }
}

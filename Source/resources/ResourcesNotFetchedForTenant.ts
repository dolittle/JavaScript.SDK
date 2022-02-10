// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';
import { TenantId } from '@dolittle/sdk.execution';

/**
 * Exception that gets thrown when attempting to get resources for a {@link TenantId} that the client has not fetched resources for.
 */
export class ResourcesNotFetchedForTenant extends Exception {
    /**
     * Initialises a new instance of the {@link ResourcesNotFetchedForTenant} class.
     * @param {TenantId} tenant - The tenant that resources has not been fetched for.
     */
    constructor(tenant: TenantId) {
        super(`No resources fetched for ${tenant}. Please make sure this tenant is configured in the Runtime.`);
    }
}

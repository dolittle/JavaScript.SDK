// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ExecutionContext, TenantId } from '@dolittle/sdk.execution';
import { Tenant } from '@dolittle/sdk.tenancy';

/**
 * Represents the result of the initial connection to a Dolittle Runtime.
 */
export class ConnectionResult {
    /**
     * Initialises a new instance of the {@link ConnectionResult} class.
     * @param {ExecutionContext} executionContext - The root execution context to use for the client.
     * @param {Tenant[]} tenants - The tenants configured for the client.
     * @param {TenantId[]} tenantIds - The tenant ids configured for the client.
     */
    constructor(
        readonly executionContext: ExecutionContext,
        readonly tenants: readonly Tenant[],
        readonly tenantIds: readonly TenantId[],
    ) {}
}

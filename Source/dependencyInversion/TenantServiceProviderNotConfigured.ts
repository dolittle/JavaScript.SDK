// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IServiceProvider } from './IServiceProvider';

/**
 * The exception that gets thrown when attempting to get an {@link IServiceProvider} for a tenant that is not configured.
 */
export class TenantServiceProviderNotConfigured extends Error {
    /**
     * Initialises a new instance of the {@link TenantServiceProviderNotConfigured} class.
     * @param {string} tenantId - The identifier of the tenant that was attempted to get a service provider for.
     */
    constructor(tenantId: string) {
        super(`There is no ${IServiceProvider.name} configured for tenant ${tenantId}`);
    }
}

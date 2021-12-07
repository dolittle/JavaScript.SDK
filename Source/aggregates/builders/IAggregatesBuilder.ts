// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { TenantId } from '@dolittle/sdk.execution';

import { IAggregates } from '../';

/**
 * Defines a builder for tenants.
 */
export abstract class IAggregatesBuilder {
    /**
     * Gets an {@link IAggregates} for a specific {@link TenantId}.
     * @param tenant - The {@link TenantId}.
     */
    abstract forTenant(tenant: TenantId): IAggregates;
}

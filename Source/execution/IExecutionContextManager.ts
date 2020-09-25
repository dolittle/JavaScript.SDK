// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ExecutionContextManager } from './ExecutionContextManager';
import { ExecutionContext } from './ExecutionContext';
import { TenantId } from './TenantId';
import { Claims } from './Claims';
import { Guid } from '@dolittle/rudiments';

/**
 * Defines a manager for working with the {@link ExecutionContext}.
 */
export interface IExecutionContextManager {
    /**
     * Gets the current execution context
     */
    readonly current: ExecutionContext;

    /**
     * Set the current execution context for a tenant and possibly claims.
     * @param {TenantId | string} tenantId Tenant to set for.
     * @param {Claims} [claims] Optional claims to set for.
     * @returns {ExecutionContext} The execution context that was set.
     */
    forTenant(tenantId: string | Guid | TenantId, claims?: Claims): ExecutionContextManager;
}

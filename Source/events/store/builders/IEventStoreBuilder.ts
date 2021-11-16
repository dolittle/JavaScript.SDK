// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { TenantIdLike } from '@dolittle/sdk.execution';
import { IEventStore } from '../index';

/**
 * Defines a builder for {@link IEventStore}.
 */

/**
 *
 */
export abstract class IEventStoreBuilder {
    /**
     * Build an {@link IEventStore} for the given tenant.
     * @param {TenantIdLike} tenantId - The tenant id.
     * @returns {IEventStore} The event store.
     */
    abstract forTenant(tenantId: TenantIdLike): IEventStore;
}

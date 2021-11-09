// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
import { Cancellation } from '@dolittle/sdk.resilience';
import { Tenant } from './Tenant';

/**
 * Represents a system that knows about Tenants in the Runtime.
 */

export abstract class ITenants {

    /**
     * Gets all tenants.
     * @param cancellation The {@link Cancellation}.
     */
    abstract getAll(cancellation: Cancellation): Promise<Tenant[]>;
}

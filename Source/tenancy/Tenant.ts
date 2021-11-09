// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { TenantId } from '@dolittle/sdk.execution';

/**
 * Represents a tenant.
 */
export class Tenant {
    /**
     * Initializes a new instance of {@link Tenant}.
     *
     */
    constructor(readonly id: TenantId) {
    }
}


// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ExecutionContext } from './ExecutionContext';
import { TenantId } from './TenantId';
import { Claims } from './Claims';

export interface IExecutionContextManager {
    readonly current: ExecutionContext;

    currentFor(tenantId: TenantId, claims?: Claims): ExecutionContext;
}


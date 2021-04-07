// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';

import { ExecutionContext, TenantId } from '@dolittle/sdk.execution';

export class ProjectionStoreBuilder {

    constructor(
        private readonly _projectionAssociations: ProjectionAssociations,
        private readonly _executionContext: ExecutionContext,
        private readonly _logger: Logger
    ) { }

    forTenant(tenantId: TenantId) {
        const executionContext = 

    }
}

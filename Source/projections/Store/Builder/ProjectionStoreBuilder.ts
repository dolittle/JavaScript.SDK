// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';

import { ExecutionContext, TenantId } from '@dolittle/sdk.execution';
import { Guid } from '@dolittle/rudiments';

import { ProjectionsClient } from '@dolittle/runtime.contracts/Projections/Store_grpc_pb';

import { IProjectionAssociations, ProjectionStore } from '..';

/**
 * Represents a builder for getting projections.
 */
export class ProjectionStoreBuilder {

    constructor(
        private readonly _projectionsClient: ProjectionsClient,
        private readonly _executionContext: ExecutionContext,
        private readonly _projectionAssociations: IProjectionAssociations,
        private readonly _logger: Logger
    ) { }

    forTenant(tenantId: TenantId) {
        const executionContext = this._executionContext
            .forTenant(tenantId)
            .forCorrelation(Guid.create());

        return new ProjectionStore(
            this._projectionsClient,
            executionContext,
            this._projectionAssociations,
            this._logger);
    }
}

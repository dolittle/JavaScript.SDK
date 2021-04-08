// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';

import { ExecutionContext, TenantId } from '@dolittle/sdk.execution';
import { Guid } from '@dolittle/rudiments';

import { ProjectionsClient } from '@dolittle/runtime.contracts/Projections/Store_grpc_pb';

import { IProjectionAssociations, IProjectionStore, ProjectionStore } from '..';

/**
 * Represents a builder for builing a projection store.
 */
export class ProjectionStoreBuilder {

    constructor(
        private readonly _projectionsClient: ProjectionsClient,
        private readonly _executionContext: ExecutionContext,
        private readonly _projectionAssociations: IProjectionAssociations,
        private readonly _logger: Logger) {
    }

    /**
     * Build an {@link IProjectionStore} for the given tenant.
     * @param {TenantId | Guid | string} tenantId The tenant id.
     * @returns {IProjectionStore} The projection store.
     */
    forTenant(tenantId: TenantId | Guid | string): IProjectionStore {
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

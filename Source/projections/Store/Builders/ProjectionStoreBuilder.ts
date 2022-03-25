// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';
import { Guid } from '@dolittle/rudiments';

import { ExecutionContext, TenantIdLike } from '@dolittle/sdk.execution';

import { ProjectionsClient } from '@dolittle/contracts/Runtime/Projections/Store_grpc_pb';

import { IProjectionReadModelTypes } from '../IProjectionReadModelTypes';
import { IProjectionStore } from '../IProjectionStore';
import { ProjectionStore } from '../ProjectionStore';
import { IProjectionStoreBuilder } from './IProjectionStoreBuilder';

/**
 * Represents an implementation of {@link IProjectionsStoreBuilder}.
 */
export class ProjectionStoreBuilder extends IProjectionStoreBuilder {

    /**
     * Initializes a new instance of {@link ProjectionStoreBuilder}.
     * @param {ProjectionsClient} _projectionsClient - The client for the projections.
     * @param {ExecutionContext} _executionContext - The execution context.
     * @param {IProjectionReadModelTypes} _readModelTypes - The projection associations.
     * @param {Logger} _logger - The logger.
     */
    constructor(
        private readonly _projectionsClient: ProjectionsClient,
        private readonly _executionContext: ExecutionContext,
        private readonly _readModelTypes: IProjectionReadModelTypes,
        private readonly _logger: Logger) {
            super();
    }

    /** @inheritdoc */
    forTenant(tenantId: TenantIdLike): IProjectionStore {
        const executionContext = this._executionContext
            .forTenant(tenantId)
            .forCorrelation(Guid.create());

        return new ProjectionStore(
            this._projectionsClient,
            executionContext,
            this._readModelTypes,
            this._logger);
    }
}

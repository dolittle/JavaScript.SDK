// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ResourcesClient } from '@dolittle/runtime.contracts/Resources/Resources_grpc_pb';
import { ExecutionContext, TenantId } from '@dolittle/sdk.execution';
import { Logger } from 'winston';

import { internal as mongoDBInternal } from './mongoDB';
import { IResourcesForTenant } from './IResourcesForTenant';
import { IResources } from './IResources';
import { ResourcesForTenant } from './ResourcesForTenant';
import { Guid } from '@dolittle/rudiments';

/**
 * Defines a system that knows about Resources provided by the Runtime.
 */
export class Resources extends IResources {

    constructor(private readonly _client: ResourcesClient, private readonly _executionContext: ExecutionContext, private readonly _logger: Logger) {
        super();
    }
    /**
     * Gets the the {@link IResourcesForTenant} resources for a specific tenant.
     * @param {TenantId} tenant The Tenant to get the {@link IResourcesForTenant} for
     */
    forTenant(tenant: TenantId): IResourcesForTenant {
        const executionContext = this._executionContext
            .forTenant(tenant)
            .forCorrelation(Guid.create());
        return new ResourcesForTenant(new mongoDBInternal.MongoDBResource(tenant, this._client, executionContext, this._logger));
    }
}

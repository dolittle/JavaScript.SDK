// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';
import { Guid } from '@dolittle/rudiments';

import { ExecutionContext, TenantId } from '@dolittle/sdk.execution';

import { ResourcesClient } from '@dolittle/runtime.contracts/Resources/Resources_grpc_pb';

import { MongoDBResource } from './MongoDB/Internal/MongoDBResource';
import { IResources } from './IResources';
import { IResourcesBuilder } from './IResourcesBuilder';
import { Resources } from './Resources';

/**
 * Defines a system that knows about Resources provided by the Runtime.
 */
export class ResourcesBuilder extends IResourcesBuilder {
    /**
     * Initialises a new instance of the {@link ResourcesBuilder} class.
     * @param {ResourcesClient} _client - The resources client to use to get resources from the Runtime.
     * @param {ExecutionContext} _executionContext - The execution context of the client.
     * @param {Logger} _logger - The logger to use for logging.
     */
    constructor(private readonly _client: ResourcesClient, private readonly _executionContext: ExecutionContext, private readonly _logger: Logger) {
        super();
    }

    /** @inheritdoc */
    forTenant(tenant: TenantId): IResources {
        const executionContext = this._executionContext
            .forTenant(tenant)
            .forCorrelation(Guid.create());
        return new Resources(new MongoDBResource(tenant, this._client, executionContext, this._logger));
    }
}

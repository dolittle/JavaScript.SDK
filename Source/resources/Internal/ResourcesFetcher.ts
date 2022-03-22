// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';

import { ComplexValueMap } from '@dolittle/sdk.artifacts';
import { ExecutionContext, TenantId } from '@dolittle/sdk.execution';
import { Cancellation } from '@dolittle/sdk.resilience';
import { Tenant } from '@dolittle/sdk.tenancy';

import { ResourcesClient } from '@dolittle/contracts/Runtime/Resources/Resources_grpc_pb';

import { MongoDBResourceCreator } from '../MongoDB/Internal/MongoDBResourceCreator';
import { IResources } from '../IResources';
import { IResourcesBuilder } from '../IResourcesBuilder';
import { Resources } from '../Resources';
import { ResourcesBuilder } from '../ResourcesBuilder';
import { IFetchResources } from './IFetchResources';

/**
 * Represents an implementation of {@link IFetchResources}.
 */
export class ResourcesFetcher extends IFetchResources {
    private readonly _mongoDB: MongoDBResourceCreator;

    /**
     * Initialises a new instance of the {@link ResourcesFetcher} class.
     * @param {ResourcesClient} client - The resources client to make requests to the Runtime with.
     * @param {ExecutionContext} executionContext - The base execution context for the client.
     * @param {Logger} logger - The logger to use for logging.
     */
    constructor(
        client: ResourcesClient,
        executionContext: ExecutionContext,
        logger: Logger,
    ) {
        super();

        this._mongoDB = new MongoDBResourceCreator(client, executionContext, logger);
    }

    /** @inheritdoc */
    async fetchResourcesFor(tenants: readonly Tenant[], cancellation: Cancellation = Cancellation.default): Promise<IResourcesBuilder> {
        const resources: Map<TenantId, IResources> = new ComplexValueMap(TenantId, _ => [_.value.toString()], 1);

        await Promise.all(tenants.map(async tenant => {
            resources.set(
                tenant.id,
                new Resources(
                    await this._mongoDB.createFor(tenant.id, cancellation),
                ),
            );
        }));

        return new ResourcesBuilder(resources);
    }
}

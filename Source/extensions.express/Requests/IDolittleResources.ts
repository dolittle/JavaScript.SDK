// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';

import { IDolittleClient } from '@dolittle/sdk';
import { IAggregates } from '@dolittle/sdk.aggregates';
import { IServiceProvider } from '@dolittle/sdk.dependencyinversion';
import { IEmbedding } from '@dolittle/sdk.embeddings';
import { IEventStore } from '@dolittle/sdk.events';
import { TenantId } from '@dolittle/sdk.execution';
import { IProjectionStore } from '@dolittle/sdk.projections';
import { IResources } from '@dolittle/sdk.resources';

/**
 * Defines the Dolittle resources available on an incoming request.
 */
export abstract class IDolittleResources {
    /**
     * Gets the {@link IDolittleClient}.
     */
    abstract readonly client: IDolittleClient;

    /**
     * Gets the {@link TenantId} associated with the current request.
     */
    abstract readonly tenant: TenantId;

    /**
     * Gets the {@link IEventStore} to use for the scope of this request.
     */
    abstract readonly eventStore: IEventStore;

    /**
     * Gets the {@link IAggregates} to use for the scope of this request.
     */
    abstract readonly aggregates: IAggregates;

    /**
     * Gets the {@link IProjectionStore} to use for the scope of this request.
     */
    abstract readonly projections: IProjectionStore;

    /**
     * Gets the {@link IEmbedding} to use for the scope of this request.
     */
    abstract readonly embeddings: IEmbedding;

    /**
     * Gets the {@link IResources} to use for the scope of this request.
     */
    abstract readonly resources: IResources;

    /**
     * Gets the {@link IServiceProvider} to use for the scope of this request.
     */
    abstract readonly services: IServiceProvider;

    /**
     * Gets the {@link Logger} used by the Dolittle client.
     */
    abstract readonly logger: Logger;
}

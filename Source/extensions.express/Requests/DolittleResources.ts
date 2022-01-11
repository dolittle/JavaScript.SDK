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

import { IDolittleResources } from './IDolittleResources';

/**
 * Represents an implementation of {@link IDolittleResources}.
 */
export class DolittleResources extends IDolittleResources {
    /**
     * Initialises a new instance of the {@link DolittleResources} class.
     * @param {IDolittleClient} client - The client to use to provide resources.
     * @param {TenantId} tenant - The tenant id to provide resources for.
     */
    constructor(
        readonly client: IDolittleClient,
        readonly tenant: TenantId
    ) {
        super();
        this.eventStore = client.eventStore.forTenant(tenant);
        this.aggregates = client.aggregates.forTenant(tenant);
        this.projections = client.projections.forTenant(tenant);
        this.embeddings = client.embeddings.forTenant(tenant);
        this.resources = client.resources.forTenant(tenant);
        this.services = client.services.forTenant(tenant);
        this.logger = client.logger;
    }

    /** @inheritdoc */
    readonly eventStore: IEventStore;

    /** @inheritdoc */
    readonly aggregates: IAggregates;

    /** @inheritdoc */
    readonly projections: IProjectionStore;

    /** @inheritdoc */
    readonly embeddings: IEmbedding;

    /** @inheritdoc */
    readonly resources: IResources;

    /** @inheritdoc */
    readonly services: IServiceProvider;

    /** @inheritdoc */
    readonly logger: Logger;
}

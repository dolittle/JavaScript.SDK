// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IAggregatesBuilder } from '@dolittle/sdk.aggregates';
import { IEventHorizons } from '@dolittle/sdk.eventhorizon';
import { IEventTypes, IEventStoreBuilder } from '@dolittle/sdk.events';
import { IEmbeddings } from '@dolittle/sdk.embeddings';
import { IProjectionStoreBuilder } from '@dolittle/sdk.projections';
import { Tenant } from '@dolittle/sdk.tenancy';
import { IResourcesBuilder } from '@dolittle/sdk.resources';

/**
 * Defines the Dolittle Client.
 */
export abstract class IDolittleClient {
    /**
     * Gets a value indicating whether the {@link IDolittleClient} is connected to the Runtime or not.
     */
    abstract get connected(): boolean;

    /**
     * Gets the {@link IEventTypes}.
     */
    abstract get eventTypes(): IEventTypes;

    /**
     * Gets the {@link IEventStoreBuilder}.
     */
    abstract get eventStore(): IEventStoreBuilder;

    /**
     * Gets the {@link IAggregatesBuilder}.
     */
    abstract get aggregates(): IAggregatesBuilder;

    /**
     * Gets the {@link IProjectionStoreBuilder}.
     */
    abstract get projections(): IProjectionStoreBuilder;

    /**
     * Gets the {@link IEmbeddings}.
     */
    abstract get embeddings(): IEmbeddings;

    /**
     * Gets the list of {@link Tenant} that is configured.
     */

    abstract get tenants(): Tenant[];

    /**
     * Gets the {@link IResourcesBuilder}.
     */
    abstract get resources(): IResourcesBuilder;

    /**
     * Gets the {@link IEventHorizons}.
     */
    abstract get eventHorizons(): IEventHorizons;
}

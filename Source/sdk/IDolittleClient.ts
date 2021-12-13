// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IAggregatesBuilder } from '@dolittle/sdk.aggregates';
import { IEventHorizons } from '@dolittle/sdk.eventhorizon';
import { IEventTypes, IEventStoreBuilder } from '@dolittle/sdk.events';
import { IEmbeddings } from '@dolittle/sdk.embeddings';
import { IProjectionStoreBuilder } from '@dolittle/sdk.projections';
import { Tenant } from '@dolittle/sdk.tenancy';
import { IResourcesBuilder } from '@dolittle/sdk.resources';
import { DolittleClientConfiguration } from './DolittleClientConfiguration';
import { Cancellation } from '@dolittle/sdk.resilience';

import { ConnectCallback } from './Builders/ConnectCallback';
import { ITenantServiceProviders } from '@dolittle/sdk.dependencyinversion';

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
     * Gets the {@link ITenantServiceProviders}.
     */
    abstract get services(): ITenantServiceProviders;

    /**
     * Gets the {@link IEventHorizons}.
     */
    abstract get eventHorizons(): IEventHorizons;

    /**
     * Connects the {@link IDolittleClient}.
     * @param {DolittleClientConfiguration} configuration - The configuration to use.
     * @param {Cancellation} [cancellation] - An optional cancellation to use to stop the connect call.
     * @returns {Promise<IDolittleClient>} A promise that when resolved, returns the connected client.
     */
    abstract connect(configuration: DolittleClientConfiguration, cancellation?: Cancellation): Promise<IDolittleClient>;

    /**
     * Connects the {@link IDolittleClient}.
     * @param {ConnectCallback} callback - A callback to use for configuring the client.
     * @param {Cancellation} [cancellation] - An optional cancellation to use to stop the connect call.
     * @returns {Promise<IDolittleClient>} A promise that when resolved, returns the connected client.
     */
    abstract connect(callback: ConnectCallback, cancellation?: Cancellation): Promise<IDolittleClient>;

    /**
     * Connects the {@link IDolittleClient}.
     * @param {Cancellation} [cancellation] - An optional cancellation to use to stop the connect call.
     * @returns {Promise<IDolittleClient>} A promise that when resolved, returns the connected client.
     */
    abstract connect(cancellation?: Cancellation): Promise<IDolittleClient>;

    /**
     * Disconnects the {@link IDolittleClient}.
     * @param {Cancellation} [cancellation] - An optional cancellation to use to stop the disonnect call.
     * @returns {Promise<void>} A promise that represents the asynchonous operation.
     */
    abstract disconnect(cancellation?: Cancellation): Promise<void>;
}

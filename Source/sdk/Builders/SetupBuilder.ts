// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { AggregateRootsBuilder, AggregateRootsBuilderCallback } from '@dolittle/sdk.aggregates';
import { ClientSetup, DependencyInversion } from '@dolittle/sdk.common';
import { EmbeddingsBuilder, EmbeddingsBuilderCallback } from '@dolittle/sdk.embeddings';
import { SubscriptionsBuilder, SubscriptionsBuilderCallback } from '@dolittle/sdk.eventhorizon';
import { EventTypesBuilder, EventTypesBuilderCallback } from '@dolittle/sdk.events';
import { EventFiltersBuilder, EventFiltersBuilderCallback } from '@dolittle/sdk.events.filtering';
import { EventHandlersBuilder, EventHandlersBuilderCallback } from '@dolittle/sdk.events.handling';
import { ProjectionAssociations, ProjectionsBuilder, ProjectionsBuilderCallback } from '@dolittle/sdk.projections';

import { DolittleClient, IDolittleClient } from '..';
import { ISetupBuilder } from './ISetupBuilder';

/**
 * Represents an implementation of {@link ISetupBuilder}.
 */
export class SetupBuilder extends ISetupBuilder {
    private readonly _eventTypesBuilder: EventTypesBuilder;
    private readonly _aggregateRootsBuilder: AggregateRootsBuilder;
    private readonly _eventFiltersBuilder: EventFiltersBuilder;
    private readonly _eventHandlersBuilder: EventHandlersBuilder;
    private readonly _projectionsAssociations: ProjectionAssociations;
    private readonly _projectionsBuilder: ProjectionsBuilder;
    private readonly _embeddingsBuilder: EmbeddingsBuilder;
    private readonly _subscriptionsBuilder: SubscriptionsBuilder;

    private _discoveryEnabled: boolean = true;

    /**
     * Initialises a new instance of the {@link SetupBuilder} class.
     */
    constructor() {
        super();

        this._eventTypesBuilder = new EventTypesBuilder();
        this._aggregateRootsBuilder = new AggregateRootsBuilder();
        this._eventFiltersBuilder = new EventFiltersBuilder();
        this._eventHandlersBuilder = new EventHandlersBuilder();
        this._projectionsAssociations = new ProjectionAssociations();
        this._projectionsBuilder = new ProjectionsBuilder(this._projectionsAssociations);
        this._embeddingsBuilder = new EmbeddingsBuilder(this._projectionsAssociations);
        this._subscriptionsBuilder = new SubscriptionsBuilder();
    }

    /** @inheritdoc */
    withEventTypes(callback: EventTypesBuilderCallback): ISetupBuilder {
        callback(this._eventTypesBuilder);
        return this;
    }

    /** @inheritdoc */
    withAggregateRoots(callback: AggregateRootsBuilderCallback): ISetupBuilder {
        callback(this._aggregateRootsBuilder);
        return this;
    }

    /** @inheritdoc */
    withFilters(callback: EventFiltersBuilderCallback): ISetupBuilder {
        callback(this._eventFiltersBuilder);
        return this;
    }

    /** @inheritdoc */
    withEventHandlers(callback: EventHandlersBuilderCallback): ISetupBuilder {
        callback(this._eventHandlersBuilder);
        return this;
    }

    /** @inheritdoc */
    withProjections(callback: ProjectionsBuilderCallback): ISetupBuilder {
        callback(this._projectionsBuilder);
        return this;
    }

    /** @inheritdoc */
    withEmbeddings(callback: EmbeddingsBuilderCallback): ISetupBuilder {
        callback(this._embeddingsBuilder);
        return this;
    }

    /** @inheritdoc */
    withEventHorizons(callback: SubscriptionsBuilderCallback): ISetupBuilder {
        callback(this._subscriptionsBuilder);
        return this;
    }

    /** @inheritdoc */
    withoutDiscovery(): ISetupBuilder {
        this._discoveryEnabled = false;
        return this;
    }

    /**
     * Builds an unconnected {@link DolittleClient}.
     * @returns {IDolittleClient} A new client.
     */
    build(): IDolittleClient {
        if (this._discoveryEnabled) {
            this.discoverAndRegisterAll();
        }

        const bindings = new DependencyInversion.ServiceProviderBuilder();
        const buildResults = new ClientSetup.ClientBuildResults();

        const eventTypes = this._eventTypesBuilder.build();

        const filters = this._eventFiltersBuilder.build(eventTypes);
        const eventHandlers = this._eventHandlersBuilder.build(eventTypes, bindings, buildResults);
        const projections = this._projectionsBuilder.build(eventTypes, buildResults);
        const embeddings = this._embeddingsBuilder.build(eventTypes, buildResults);
        const [subscriptions, subscriptionCallbacks] = this._subscriptionsBuilder.build();

        return new DolittleClient(
            bindings,
            buildResults,
            eventTypes,
            this._aggregateRootsBuilder,
            filters,
            eventHandlers,
            this._projectionsAssociations,
            projections,
            embeddings,
            subscriptions,
            subscriptionCallbacks);
    }

    private discoverAndRegisterAll(): void {
        // TODO: Implement
    }
}

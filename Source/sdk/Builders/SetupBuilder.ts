// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { AggregateRootsBuilder, AggregateRootsBuilderCallback, AggregateRootsModelBuilder, isDecoratedAggregateRootType } from '@dolittle/sdk.aggregates';
import { ClientSetup, Model } from '@dolittle/sdk.common';
import { ServiceProviderBuilder } from '@dolittle/sdk.dependencyinversion';
import { EmbeddingsBuilder, EmbeddingsBuilderCallback, EmbeddingsModelBuilder, isDecoratedEmbeddingType } from '@dolittle/sdk.embeddings';
import { SubscriptionsBuilder, SubscriptionsBuilderCallback } from '@dolittle/sdk.eventhorizon';
import { EventTypesBuilder, EventTypesBuilderCallback, EventTypesModelBuilder, isDecoratedWithEventType } from '@dolittle/sdk.events';
import { EventFiltersBuilder, EventFiltersBuilderCallback, EventFiltersModelBuilder } from '@dolittle/sdk.events.filtering';
import { EventHandlersBuilder, EventHandlersBuilderCallback, EventHandlersModelBuilder, isDecoratedEventHandlerType } from '@dolittle/sdk.events.handling';
import { isDecoratedProjectionType, ProjectionsBuilder, ProjectionsBuilderCallback, ProjectionsModelBuilder } from '@dolittle/sdk.projections';

import { ICanTraverseModules } from '../Internal/Discovery/ICanTraverseModules';
import { ModuleTraverser } from '../Internal/Discovery/ModuleTraverser';
import { DolittleClient } from '../DolittleClient';
import { IDolittleClient } from '../IDolittleClient';
import { ISetupBuilder } from './ISetupBuilder';

/**
 * Represents an implementation of {@link ISetupBuilder}.
 */
export class SetupBuilder extends ISetupBuilder {
    private readonly _modelBuilder: Model.ModelBuilder;
    private readonly _buildResults: ClientSetup.ClientBuildResults;

    private readonly _eventTypesBuilder: EventTypesBuilder;
    private readonly _aggregateRootsBuilder: AggregateRootsBuilder;
    private readonly _eventFiltersBuilder: EventFiltersBuilder;
    private readonly _eventHandlersBuilder: EventHandlersBuilder;
    private readonly _projectionsBuilder: ProjectionsBuilder;
    private readonly _embeddingsBuilder: EmbeddingsBuilder;
    private readonly _subscriptionsBuilder: SubscriptionsBuilder;

    private readonly _moduleTraverser: ICanTraverseModules;
    private _discoveryEnabled: boolean = true;

    /**
     * Initialises a new instance of the {@link SetupBuilder} class.
     */
    constructor() {
        super();

        this._modelBuilder = new Model.ModelBuilder();
        this._buildResults = new ClientSetup.ClientBuildResults();

        this._eventTypesBuilder = new EventTypesBuilder(this._modelBuilder, this._buildResults);
        this._aggregateRootsBuilder = new AggregateRootsBuilder(this._modelBuilder, this._buildResults);
        this._eventFiltersBuilder = new EventFiltersBuilder(this._modelBuilder, this._buildResults);
        this._eventHandlersBuilder = new EventHandlersBuilder(this._modelBuilder, this._buildResults);
        this._projectionsBuilder = new ProjectionsBuilder(this._modelBuilder, this._buildResults);
        this._embeddingsBuilder = new EmbeddingsBuilder(this._modelBuilder, this._buildResults);
        this._subscriptionsBuilder = new SubscriptionsBuilder();

        this._moduleTraverser = new ModuleTraverser();
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

        const bindings = new ServiceProviderBuilder();

        const model = this._modelBuilder.build(this._buildResults);

        const eventTypes = new EventTypesModelBuilder(model).build();
        const aggregateRootTypes = new AggregateRootsModelBuilder(model, bindings).build();

        const filters = new EventFiltersModelBuilder(model, this._buildResults, eventTypes).build();
        const eventHandlers = new EventHandlersModelBuilder(model, this._buildResults, eventTypes, bindings).build();
        const [projections, projectionReadModelTypes] = new ProjectionsModelBuilder(model, this._buildResults, eventTypes, bindings).build();
        const [embeddings, embeddingReadModelTypes] = new EmbeddingsModelBuilder(model, this._buildResults, eventTypes).build();

        const [subscriptions, subscriptionCallbacks] = this._subscriptionsBuilder.build();

        return new DolittleClient(
            bindings,
            this._buildResults,
            eventTypes,
            aggregateRootTypes,
            filters,
            eventHandlers,
            projections,
            projectionReadModelTypes,
            embeddings,
            embeddingReadModelTypes,
            subscriptions,
            subscriptionCallbacks);
    }

    private discoverAndRegisterAll(): void {
        this._moduleTraverser.forEachClass((type) => {
            if (isDecoratedWithEventType(type)) {
                this._eventTypesBuilder.register(type);
            }

            if (isDecoratedAggregateRootType(type)) {
                this._aggregateRootsBuilder.register(type);
            }

            if (isDecoratedEventHandlerType(type)) {
                this._eventHandlersBuilder.register(type);
            }

            if (isDecoratedProjectionType(type)) {
                this._projectionsBuilder.register(type);
            }

            if (isDecoratedEmbeddingType(type)) {
                this._embeddingsBuilder.register(type);
            }
        });
    }
}

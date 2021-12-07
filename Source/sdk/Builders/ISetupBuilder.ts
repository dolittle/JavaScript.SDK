// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { AggregateRootsBuilderCallback } from '@dolittle/sdk.aggregates';
import { EmbeddingsBuilderCallback } from '@dolittle/sdk.embeddings';
import { SubscriptionsBuilderCallback } from '@dolittle/sdk.eventhorizon';
import { EventTypesBuilderCallback } from '@dolittle/sdk.events';
import { EventFiltersBuilderCallback } from '@dolittle/sdk.events.filtering';
import { EventHandlersBuilderCallback } from '@dolittle/sdk.events.handling';
import { ProjectionsBuilderCallback } from '@dolittle/sdk.projections';

import { IDolittleClient } from '../';

/**
 * Defines a builder for setting up a {@link IDolittleClient}.
 */
export abstract class ISetupBuilder {
    /**
     * Configure event types.
     *
     * @param {EventTypesBuilderCallback} callback - The builder callback.
     * @returns {ISetupBuilder} The setup builder for continuation.
     */
    abstract withEventTypes(callback: EventTypesBuilderCallback): ISetupBuilder;

    /**
     * Configure aggregate roots.
     *
     * @param {AggregateRootsBuilderCallback} callback - The builder callback.
     * @returns {ISetupBuilder} The client builder for continuation.
     */
    abstract withAggregateRoots(callback: AggregateRootsBuilderCallback): ISetupBuilder;

    /**
     * Configure event filters.
     *
     * @param {EventFiltersBuilderCallback} callback - The builder callback.
     * @returns {ISetupBuilder} The client builder for continuation.
     */
    abstract withFilters(callback: EventFiltersBuilderCallback): ISetupBuilder;

    /**
     * Configure event handlers.
     *
     * @param {EventHandlersBuilderCallback} callback - The builder callback.
     * @returns {ISetupBuilder} The client builder for continuation.
     */
    abstract withEventHandlers(callback: EventHandlersBuilderCallback): ISetupBuilder;

    /**
     * Configure projections.
     * @param {ProjectionsBuilderCallback} callback - The builder callback.
     * @returns {ISetupBuilder} The client builder for continuation.
     */
    abstract withProjections(callback: ProjectionsBuilderCallback): ISetupBuilder;

    /**
     * Configure embeddings.
     * @param {EmbeddingsBuilderCallback} callback - The builder callback.
     * @returns {ISetupBuilder} The client builder for continuation.
     */
    abstract withEmbeddings(callback: EmbeddingsBuilderCallback): ISetupBuilder;

    /**
     * Configure event horizons and any subscriptions.
     * @param {SubscriptionsBuilderCallback} callback - The builder callback.
     * @returns {ISetupBuilder} The client builder for continuation.
     */
    abstract withEventHorizons(callback: SubscriptionsBuilderCallback): ISetupBuilder;

    /**
     * Turns off automatic discovery and registration.
     * @returns {ISetupBuilder} The client builder for continuation.
     */
    abstract withoutDiscovery(): ISetupBuilder;
}

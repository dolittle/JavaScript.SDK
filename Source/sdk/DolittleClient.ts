// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { AggregateRootsBuilder } from '@dolittle/sdk.aggregates';
import { EmbeddingsBuilder } from '@dolittle/sdk.embeddings';
import { SubscriptionsBuilder } from '@dolittle/sdk.eventhorizon';
import { EventTypesBuilder } from '@dolittle/sdk.events';
import { EventFiltersBuilder } from '@dolittle/sdk.events.filtering';
import { EventHandlersBuilder } from '@dolittle/sdk.events.handling';
import { ProjectionAssociations, ProjectionsBuilder } from '@dolittle/sdk.projections';

import { SetupBuilder, SetupCallback } from './Builders/';
import { IDolittleClient } from './IDolittleClient';

/**
 * Represents the client for working with the Dolittle Runtime.
 */
export class DolittleClient extends IDolittleClient {
    /**
     * Initialises a new instance of the {@link DolittleClient} class.
     * @param {EventTypesBuilder} _eventTypesBuilder - The {@link EventTypesBuilder}.
     * @param {AggregateRootsBuilder} _aggregateRootsBuilder - The {@link AggregateRootsBuilder}.
     * @param {EventFiltersBuilder} _eventFiltersBuilder - The {@link EventFiltersBuilder}.
     * @param {EventHandlersBuilder} _eventHandlersBuilder - The {@link EventHandlersBuilder}.
     * @param {ProjectionAssociations} _projectionsAssociations - The {@link ProjectionAssociations}.
     * @param {ProjectionsBuilder} _projectionsBuilder - The {@link ProjectionsBuilder}.
     * @param {EmbeddingsBuilder} _embeddingsBuilder - The {@link EmbeddingsBuilder}.
     * @param {SubscriptionsBuilder} _subscriptionsBuilder - The {@link SubscriptionsBuilder}.
     */
    constructor(
        private readonly _eventTypesBuilder: EventTypesBuilder,
        private readonly _aggregateRootsBuilder: AggregateRootsBuilder,
        private readonly _eventFiltersBuilder: EventFiltersBuilder,
        private readonly _eventHandlersBuilder: EventHandlersBuilder,
        private readonly _projectionsAssociations: ProjectionAssociations,
        private readonly _projectionsBuilder: ProjectionsBuilder,
        private readonly _embeddingsBuilder: EmbeddingsBuilder,
        private readonly _subscriptionsBuilder: SubscriptionsBuilder
    ) {
        super();
    }

    /**
     * Setup a new {@link IDolittleClient}.
     * @param {SetupCallback} [callback] - The optional callback to use to setup the new client.
     * @returns {IDolittleClient} An new unconnected client.
     */
    static setup(callback?: SetupCallback): IDolittleClient {
        const builder = new SetupBuilder();

        if (typeof callback === 'function') {
            callback(builder);
        }

        return builder.build();
    }
}

// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { AggregateOf, AggregateRoot, IAggregateRootOperations } from '@dolittle/sdk.aggregates';
import { Embeddings, IEmbeddings } from '@dolittle/sdk.embeddings';
import { IEventHorizons } from '@dolittle/sdk.eventhorizon';
import { EventSourceId, EventStoreBuilder, IEventStoreBuilder, IEventTypes } from '@dolittle/sdk.events';
import { IFilters } from '@dolittle/sdk.events.filtering';
import { IEventHandlers } from '@dolittle/sdk.events.handling';
import { MicroserviceId } from '@dolittle/sdk.execution';
import { IProjectionStoreBuilder, ProjectionStoreBuilder } from '@dolittle/sdk.projections';
import { IResources, IResourcesBuilder } from '@dolittle/sdk.resources';
import { ITenants } from '@dolittle/sdk.tenancy';
import { Constructor } from '@dolittle/types';
import { Logger } from 'winston';
import { DolittleClientBuilder } from './DolittleClientBuilder';
import { EventStoreBuilderCallback } from './EventStoreBuilderCallback';
import { IDolittleClient } from './IDolittleClient';

/**
 * Represents the client for working with the Dolittle Runtime.
 */
export class DolittleClient extends IDolittleClient {
    /**
     * Creates an instance of client.
     * @param {Logger} logger - Winston Logger for logging.
     * @param {IEventTypes} eventTypes - All the registered event types.
     * @param {IEventStoreBuilder} eventStore - The event store builder to work with.
     * @param {IEventHandlers} eventHandlers - All the event handlers.
     * @param {IFilters} filters - All the filters.
     * @param {IEventHorizons} eventHorizons - All event horizons.
     * @param {IProjectionStoreBuilder} projections - All projections.
     * @param {IEmbeddings} embeddings - All embeddings.
     * @param {ITenants} tenants - All tenants.
     * @param {IResources} resources - All resources.
     */
    constructor(
        readonly logger: Logger,
        readonly eventTypes: IEventTypes,
        readonly eventStore: IEventStoreBuilder,
        readonly eventHandlers: IEventHandlers,
        readonly filters: IFilters,
        readonly eventHorizons: IEventHorizons,
        readonly projections: IProjectionStoreBuilder,
        readonly embeddings: IEmbeddings,
        readonly tenants: ITenants,
        readonly resources: IResourcesBuilder) {
            super();
    }

    /**
     * Create a client builder for a Microservice.
     * @param {MicroserviceId | Guid | string} microserviceId - The unique identifier for the microservice.
     * @returns {DolittleClientBuilder} The builder to build a {Client} from.
     */
    static forMicroservice(microserviceId: MicroserviceId | Guid | string) {
        return new DolittleClientBuilder(MicroserviceId.from(microserviceId));
    }

    /** @inheritdoc */
    aggregateOf<TAggregateRoot extends AggregateRoot>(type: Constructor<any>, buildEventStore: EventStoreBuilderCallback): IAggregateRootOperations<TAggregateRoot>

    /** @inheritdoc */
    aggregateOf<TAggregateRoot extends AggregateRoot>(type: Constructor<TAggregateRoot>, eventSourceId: EventSourceId | Guid | string, buildEventStore: EventStoreBuilderCallback): IAggregateRootOperations<TAggregateRoot>
    aggregateOf<TAggregateRoot extends AggregateRoot>(type: Constructor<TAggregateRoot>, eventSourceIdOrBuilder: EventStoreBuilderCallback | EventSourceId | Guid | string, buildEventStore?: EventStoreBuilderCallback): IAggregateRootOperations<TAggregateRoot> {
        if (buildEventStore) {
            return new AggregateOf(type, buildEventStore(this.eventStore), this.eventTypes, this.logger).get(EventSourceId.from(eventSourceIdOrBuilder as any));
        } else {
            return new AggregateOf(type, (eventSourceIdOrBuilder as EventStoreBuilderCallback)(this.eventStore), this.eventTypes, this.logger).create();
        }
    }
}

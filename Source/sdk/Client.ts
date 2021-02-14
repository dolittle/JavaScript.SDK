// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';

import { IEventTypes } from '@dolittle/sdk.artifacts';
import { EventSourceId, EventStoreBuilder, IEventStore } from '@dolittle/sdk.events';
import { IFilters } from '@dolittle/sdk.events.filtering';
import { IEventHandlers } from '@dolittle/sdk.events.handling';
import { MicroserviceId } from '@dolittle/sdk.execution';
import { IEventHorizons } from '@dolittle/sdk.eventhorizon';
import { Guid } from '@dolittle/rudiments';

import { ClientBuilder } from './ClientBuilder';
import { AggregateRoot, IAggregateOf, AggregateOf, IAggregateRootOperations } from '@dolittle/sdk.aggregates';
import { Constructor } from '@dolittle/types';

export type EventStoreBuilderCallback = (builder: EventStoreBuilder) => IEventStore;


/**
 * Represents the client for working with the Dolittle Runtime
 */
export class Client {

    /**
     * Creates an instance of client.
     * @param {Logger} logger Winston Logger for logging.
     * @param {IArtifacts} artifacts All the configured artifacts.
     * @param {EventStoreBuilder} eventStore The event store builder to work with.
     * @param {IEventHandlers} eventHandlers All the event handlers.
     * @param {IFilters} filters All the filters.
     * @param {IEventHorizons} eventHorizons All event horizons.
     */
    constructor(
        readonly logger: Logger,
        readonly eventTypes: IEventTypes,
        readonly eventStore: EventStoreBuilder,
        readonly eventHandlers: IEventHandlers,
        readonly filters: IFilters,
        readonly eventHorizons: IEventHorizons) {
    }

    /**
     * Create a client builder for a Microservice
     * @param {MicroserviceId | Guid | string} microserviceId The unique identifier for the microservice.
     * @returns {ClientBuilder} The builder to build a {Client} from.
     */
    static forMicroservice(microserviceId: MicroserviceId | Guid | string) {
        return new ClientBuilder(MicroserviceId.from(microserviceId));
    }

    /**
     * Gets the {@link IAggregateRootOperations<TAggregate>} for a new aggregate of the specified type
     * @template TAggregateRoot
     * @param {Constructor<any> type Type of aggregate - corresponding to the generic type
     * @param {EventStoreBuilderCallback} buildEventStore Callback for building the context for the event store
     * @returns {IAggregateRootOperations<TAggregate>}
     */
    aggregateOf<TAggregateRoot extends AggregateRoot>(type: Constructor<any>, buildEventStore: EventStoreBuilderCallback): IAggregateRootOperations<TAggregateRoot>

    /**
     * Gets the {@link IAggregateRootOperations<TAggregate>} for an existing aggregate of the specified type
     * @template TAggregateRoot
     * @param {Constructor<any> type Type of aggregate - corresponding to the generic type.
     * @param {EventSourceId} eventSourceId The event source id of the aggregate
     * @param {EventStoreBuilderCallback} buildEventStore Callback for building the context for the event store.
     * @returns {IAggregateRootOperations<TAggregate>}
     */
    aggregateOf<TAggregateRoot extends AggregateRoot>(type: Constructor<TAggregateRoot>, eventSourceId: EventSourceId | Guid | string, buildEventStore: EventStoreBuilderCallback): IAggregateRootOperations<TAggregateRoot>
    aggregateOf<TAggregateRoot extends AggregateRoot>(type: Constructor<TAggregateRoot>, eventSourceIdOrBuilder: EventStoreBuilderCallback | EventSourceId | Guid | string, buildEventStore?: EventStoreBuilderCallback): IAggregateRootOperations<TAggregateRoot> {
        if (buildEventStore) {
            return new AggregateOf(type, buildEventStore(this.eventStore), this.eventTypes, this.logger).get(EventSourceId.from(eventSourceIdOrBuilder as any));
        } else {
            return new AggregateOf(type, (eventSourceIdOrBuilder as EventStoreBuilderCallback)(this.eventStore), this.eventTypes, this.logger).create();
        }
    }
}

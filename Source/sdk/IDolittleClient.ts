// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
import { Guid } from '@dolittle/rudiments';
import { AggregateRoot, IAggregateRootOperations } from '@dolittle/sdk.aggregates';
import { IEventHorizons } from '@dolittle/sdk.eventhorizon';
import { EventSourceId, IEventTypes, IEventStoreBuilder } from '@dolittle/sdk.events';
import { IEmbeddings } from '@dolittle/sdk.embeddings';
import { IProjectionStoreBuilder } from '@dolittle/sdk.projections';
import { ITenants } from '@dolittle/sdk.tenancy';
import { Constructor } from '@dolittle/types';
import { Logger } from 'winston';
import { EventStoreBuilderCallback } from './EventStoreBuilderCallback';

/**
 * Defines the Dolittle client.
 */
export abstract class IDolittleClient {
    /**
     * Gets the {@link IEventTypes}.
     */
    abstract get eventTypes(): IEventTypes;

    /**
     * Gets the {@link IEventStoreBuilder}.
     */
    abstract get eventStore(): IEventStoreBuilder;

    /**
     * Gets the {@link IProjectionStoreBuilder}.
     */
    abstract get projections(): IProjectionStoreBuilder;

    /**
     * Gets the {@link IEmbeddings}.
     */
    abstract get embeddings(): IEmbeddings;

    /**
     * Gets the {@link IEventHorizons}.
     */
    abstract get eventHorizons(): IEventHorizons;

    /**
     * Gets the {@link ITenants}.
     */
    abstract get tenants(): ITenants;

    /**
     * Gets the {@link Logger}.
     */
    abstract get logger(): Logger;

    /**
     * Gets the {@link IAggregateRootOperations<TAggregate>} for a new aggregate of the specified type
     * @template TAggregateRoot
     * @param {Constructor<any> type Type of aggregate - corresponding to the generic type
     * @param {EventStoreBuilderCallback} buildEventStore Callback for building the context for the event store
     * @returns {IAggregateRootOperations<TAggregate>}
     */
    abstract aggregateOf<TAggregateRoot extends AggregateRoot>(type: Constructor<any>, buildEventStore: EventStoreBuilderCallback): IAggregateRootOperations<TAggregateRoot>;

    /**
     * Gets the {@link IAggregateRootOperations<TAggregate>} for an existing aggregate of the specified type
     * @template TAggregateRoot
     * @param {Constructor<any> type Type of aggregate - corresponding to the generic type.
     * @param {EventSourceId} eventSourceId The event source id of the aggregate
     * @param {EventStoreBuilderCallback} buildEventStore Callback for building the context for the event store.
     * @returns {IAggregateRootOperations<TAggregate>}
     */
    abstract aggregateOf<TAggregateRoot extends AggregateRoot>(type: Constructor<TAggregateRoot>, eventSourceId: EventSourceId | Guid | string, buildEventStore: EventStoreBuilderCallback): IAggregateRootOperations<TAggregateRoot>;
}

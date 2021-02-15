// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { EventType, EventTypeId } from '@dolittle/sdk.artifacts';
import { Cancellation } from '@dolittle/sdk.resilience';

import { CommitEventsResult } from './CommitEventsResult';
import { EventSourceId } from './EventSourceId';
import { UncommittedEvent } from './UncommittedEvent';
import { AggregateRootId } from './AggregateRootId';
import { CommitForAggregateBuilder } from './CommitForAggregateBuilder';
import { CommittedAggregateEvents } from './CommittedAggregateEvents';
import { UncommittedAggregateEvents } from './UncommittedAggregateEvents';
import { AggregateRootVersion } from './AggregateRootVersion';
import { CommitAggregateEventsResult } from './CommitAggregateEventsResult';
;

/**
 * Defines the API surface for the event store
 */
export interface IEventStore {

    /**
     * Commit a single event.
     * @param {*} event The content of the event.
     * @param {EventSourceId | Guid | string} eventSourceId The source of the event - a unique identifier that is associated with the event.
     * @param {EventType | EventTypeId | Guid | string} eventType An event type or an identifier representing the event type.
     * @param {Cancellation} cancellation The cancellation signal.
     * @returns {Promise<CommitEventsResult>}
     * @summary If no event type identifier or event type is supplied, it will look for associated event types based
     * on the actual type of the event.
     */
    commit(event: any, eventSourceId: EventSourceId | Guid | string, eventType?: EventType | EventTypeId | Guid | string, cancellation?: Cancellation): Promise<CommitEventsResult>;

    /**
     * Commit a collection of events.
     * @param {UncommittedEvent|UncommittedEvent[]} eventOrEvents The event or events.
     * @param {Cancellation} cancellation The cancellation signal.
     * @returns {Promise<CommitEventsResult>}
     * @summary If no event type identifier or event type is supplied, it will look for associated event types based
     * @summary on the actual type of the event.
     */
    commit(eventOrEvents: UncommittedEvent | UncommittedEvent[], cancellation?: Cancellation): Promise<CommitEventsResult>;

    /**
     * Commit a single public event.
     * @param {*} event The content of the event.
     * @param {EventSourceId | Guid | string} eventSourceId The source of the event - a unique identifier that is associated with the event.
     * @param {EventType | EventTypeId | Guid | string} eventType An event type or an identifier representing the event type.
     * @param {Cancellation} cancellation The cancellation signal.
     * @returns {Promise<CommitEventsResult>}
     * @summary If no event type identifier or event type is supplied, it will look for associated event types based
     * on the actual type of the event.
     */
    commitPublic(event: any, eventSourceId: EventSourceId | Guid | string, eventType?: EventType | EventTypeId | Guid | string, cancellation?: Cancellation): Promise<CommitEventsResult>;

    /**
     * Commit a single event for an aggregate.
     * @param {*} event The content of the event.
     * @param {EventSourceId | Guid | string } eventSourceId The source of the event - a unique identifier that is associated with the event.
     * @param {AggregateRootId} aggregateRootId The type of the aggregate root that applied the event to the Event Source
     * @param {AggregateRootVersion} expectedAggregateRootVersion The {AggregateRootVersion} of the Aggregate Root that was used to apply the rules that resulted in the Events.
     * The events can only be committed to the Event Store if the version of Aggregate Root has not changed.
     * @param {EventType|Guid|string} [eventType] An artifact or an identifier representing the artifact.
     * @param {Cancellation} cancellation The cancellation signal.
     * @returns {Promise<CommitEventsResponse>}
     * @summary If no event type identifier or event type is supplied, it will look for associated artifacts based
     * on the actual type of the event.
     */
    commitForAggregate(event: any, eventSourceId: EventSourceId | Guid | string, aggregateRootId: AggregateRootId, expectedAggregateRootVersion: AggregateRootVersion, eventType?: EventType | EventTypeId | Guid | string, cancellation?: Cancellation): Promise<CommitAggregateEventsResult>;

    /**
     * Commit a collection of events.
     * @param {UncommittedEvent} events Collection of aggregate events.
     * @param {Cancellation} cancellation The cancellation signal.
     * @returns Promise<CommitEventsResponse>
     * @summary If no artifact identifier or artifact is supplied, it will look for associated artifacts based
     * @summary on the actual type of the event.
     */
    commitForAggregate(events: UncommittedAggregateEvents, cancellation?: Cancellation): Promise<CommitAggregateEventsResult>;

    /**
     * Commit for aggregate root.
     * @param {AggregateRoot} aggregateRootId Aggregate root to commit for.
     * @param {Cancellation} cancellation The cancellation signal
     * @returns {CommitForAggregateBuilder}
     */
    forAggregate(aggregateRootId: AggregateRootId): CommitForAggregateBuilder;

    /**
     * Fetches the {@link CommittedAggregateEvents} for an aggregate root.
     * @param {AggregateRootId} aggregateRootId The aggregate root to fetch for.
     * @param {EventSourceId} eventSourceId The event source id to fetch for.
     * @param {Cancellation} cancellation The cancellation signal.
     * @returns {Promise<CommittedAggregateEvents>}
     */
    fetchForAggregate(aggregateRootId: AggregateRootId, eventSourceId: EventSourceId, cancellation?: Cancellation): Promise<CommittedAggregateEvents>;


    /**
     * Fetches the {@link CommittedAggregateEvents} for an aggregate root - synchronously.
     * @param {AggregateRootId} aggregateRootId The aggregate root to fetch for.
     * @param {EventSourceId} eventSourceId The event source id to fetch for.
     * @param {Cancellation} cancellation The cancellation signal.
     * @returns {Promise<CommittedAggregateEvents>}
     */
    fetchForAggregateSync(aggregateRootId: AggregateRootId, eventSourceId: EventSourceId, cancellation?: Cancellation): CommittedAggregateEvents;
}



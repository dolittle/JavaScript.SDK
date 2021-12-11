// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';

import { Cancellation } from '@dolittle/sdk.resilience';

import { AggregateRootId } from '../AggregateRootId';
import { AggregateRootVersion } from '../AggregateRootVersion';
import { EventSourceId } from '../EventSourceId';
import { EventType } from '../EventType';
import { EventTypeId } from '../EventTypeId';
import { CommitForAggregateBuilder } from './builders/CommitForAggregateBuilder';
import { CommitAggregateEventsResult } from './CommitAggregateEventsResult';
import { CommitEventsResult } from './CommitEventsResult';
import { CommittedAggregateEvents } from './CommittedAggregateEvents';
import { UncommittedAggregateEvents } from './UncommittedAggregateEvents';
import { UncommittedEvent } from './UncommittedEvent';

/**
 * Defines the API surface for the event store.
 */
export abstract class IEventStore {

    /**
     * Commit a single event.
     * @param {*} event - The content of the event.
     * @param {EventSourceId | Guid | string} eventSourceId - The source of the event - a unique identifier that is associated with the event.
     * @param {EventType | EventTypeId | Guid | string} eventType - An event type or an identifier representing the event type.
     * @param {Cancellation} cancellation - The cancellation signal.
     * @returns {Promise<CommitEventsResult>}
     * @summary If no event type identifier or event type is supplied, it will look for associated event types based
     * on the actual type of the event.
     */
    abstract commit(event: any, eventSourceId: EventSourceId | Guid | string, eventType?: EventType | EventTypeId | Guid | string, cancellation?: Cancellation): Promise<CommitEventsResult>;

    /**
     * Commit a collection of events.
     * @param {UncommittedEvent|UncommittedEvent[]} eventOrEvents - The event or events.
     * @param {Cancellation} cancellation - The cancellation signal.
     * @returns {Promise<CommitEventsResult>}
     * @summary If no event type identifier or event type is supplied, it will look for associated event types based.
     * @summary On the actual type of the event.
     */
    abstract commit(eventOrEvents: UncommittedEvent | UncommittedEvent[], cancellation?: Cancellation): Promise<CommitEventsResult>;

    /**
     * Commit a single public event.
     * @param {*} event - The content of the event.
     * @param {EventSourceId | Guid | string} eventSourceId - The source of the event - a unique identifier that is associated with the event.
     * @param {EventType | EventTypeId | Guid | string} eventType - An event type or an identifier representing the event type.
     * @param {Cancellation} cancellation - The cancellation signal.
     * @returns {Promise<CommitEventsResult>}
     * @summary If no event type identifier or event type is supplied, it will look for associated event types based
     * on the actual type of the event.
     */
    abstract commitPublic(event: any, eventSourceId: EventSourceId | Guid | string, eventType?: EventType | EventTypeId | Guid | string, cancellation?: Cancellation): Promise<CommitEventsResult>;

    /**
     * Commit a single event for an aggregate.
     * @param {*} event - The content of the event.
     * @param {EventSourceId | Guid | string } eventSourceId - The source of the event - a unique identifier that is associated with the event.
     * @param {AggregateRootId} aggregateRootId - The type of the aggregate root that applied the event to the Event Source.
     * @param {AggregateRootVersion} expectedAggregateRootVersion - The {AggregateRootVersion} of the Aggregate Root that was used to apply the rules that resulted in the Events.
     * The events can only be committed to the Event Store if the version of Aggregate Root has not changed.
     * @param {EventType|Guid|string} [eventType] - An artifact or an identifier representing the artifact.
     * @param {Cancellation} cancellation - The cancellation signal.
     * @returns {Promise<CommitAggregateEventsResult>}
     * @summary If no event type identifier or event type is supplied, it will look for associated artifacts based
     * on the actual type of the event.
     */
    abstract commitForAggregate(event: any, eventSourceId: EventSourceId | Guid | string, aggregateRootId: AggregateRootId, expectedAggregateRootVersion: AggregateRootVersion, eventType?: EventType | EventTypeId | Guid | string, cancellation?: Cancellation): Promise<CommitAggregateEventsResult>;

    /**
     * Commit a collection of events.
     * @param {UncommittedEvent} events - Collection of aggregate events.
     * @param {Cancellation} cancellation - The cancellation signal.
     * @returns Promise<CommitEventsResponse>.
     * @summary If no artifact identifier or artifact is supplied, it will look for associated artifacts based.
     * @summary On the actual type of the event.
     */
    abstract commitForAggregate(events: UncommittedAggregateEvents, cancellation?: Cancellation): Promise<CommitAggregateEventsResult>;

    /**
     * Commit for aggregate root.
     * @param {AggregateRootId} aggregateRootId - Aggregate root to commit for.
     * @param {Cancellation} cancellation - The cancellation signal.
     * @returns {CommitForAggregateBuilder}
     */
    abstract forAggregate(aggregateRootId: AggregateRootId): CommitForAggregateBuilder;

    /**
     * Fetches the {@link CommittedAggregateEvents} for an aggregate root.
     * @param {AggregateRootId} aggregateRootId - The aggregate root to fetch for.
     * @param {EventSourceId} eventSourceId - The event source id to fetch for.
     * @param {Cancellation} cancellation - The cancellation signal.
     * @returns {Promise<CommittedAggregateEvents>}
     */
    abstract fetchForAggregate(aggregateRootId: AggregateRootId, eventSourceId: EventSourceId, cancellation?: Cancellation): Promise<CommittedAggregateEvents>;
}

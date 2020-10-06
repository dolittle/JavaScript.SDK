// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { EventType, EventTypeId } from '@dolittle/sdk.artifacts';
import { Cancellation } from '@dolittle/sdk.resilience';

import { CommitEventsResult } from './CommitEventsResult';
import { EventSourceId } from './EventSourceId';
import { UncommittedEvent } from './UncommittedEvent';
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
     * @returns Promise<CommitEventsResult>
     * @summary If no event type identifier or event type is supplied, it will look for associated event types based
     * on the actual type of the event.
     */
    commit(event: any, eventSourceId: EventSourceId | Guid | string, eventType?: EventType | EventTypeId | Guid | string, cancellation?: Cancellation): Promise<CommitEventsResult>;

    /**
     * Commit a collection of events.
     * @param {UncommittedEvent|UncommittedEvent[]} eventOrEvents The event or events.
     * @param {Cancellation} cancellation The cancellation signal.
     * @returns Promise<CommitEventsResult>
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
     * @returns Promise<CommitEventsResult>
     * @summary If no event type identifier or event type is supplied, it will look for associated event types based
     * on the actual type of the event.
     */
    commitPublic(event: any, eventSourceId: EventSourceId | Guid | string, eventType?: EventType | EventTypeId | Guid | string, cancellation?: Cancellation): Promise<CommitEventsResult>;
}

// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { AggregateRootId } from './AggregateRootId';
import { AggregateRootVersion } from './AggregateRootVersion';
import { EventSourceId } from './EventSourceId';
import { UncommittedAggregateEvent } from './UncommittedAggregateEvent';
import { EventContentNeedsToBeDefined } from './EventContentNeedsToBeDefined';
import { Guid } from '@dolittle/rudiments';

/**
 * Represents a sequence of {@link UncommittedAggregateEvent}s that have not been committed to the Event Store.
 */
export class UncommittedAggregateEvents implements Iterable<UncommittedAggregateEvent> {
    private _events: UncommittedAggregateEvent[] = [];

    /**
     * Creates an instance of {@link UncommittedAggregateEvents}.
     */
    constructor(
        readonly eventSourceId: EventSourceId,
        readonly aggregateRootId: AggregateRootId,
        readonly expectedAggregateRootVersion: AggregateRootVersion,
        ...events: UncommittedAggregateEvent[]) {
        if (events) {
            this._events = events;
        }
    }

    /**
     * Gets whether or not there are events.
     * @returns {Boolean}
     */
    get hasEvents(): boolean {
        return this._events.length > 0;
    }

    /**
     * Gets the length of the committed events array.
     * @returns {Number}
     */
    get length(): number {
        return this._events.length;
    }

    /** @inheritdoc */
    [Symbol.iterator](): Iterator<UncommittedAggregateEvent> {
        return this._events[Symbol.iterator]();
    }

    add(event: UncommittedAggregateEvent) {
        this.throwIfEventContentIsNullOrUndefined(event);
        this._events.push(event);
    }


    /**
     * Creates uncommitted aggregate events from the provided events and metadata.
     * @param eventSourceId The event source id that the uncommitted events will be applied to.
     * @param aggregateRootId The aggregate root id that the uncommitted events will be applied to.
     * @param expectedAggregateRootVersion The previous aggregate root version that was used to produce the uncommitted events.
     * @param events The uncommitted events to apply.
     * @returns {UncommittedAggregateEvents} Uncommitted aggregate events
     */
    static from(eventSourceId: EventSourceId | Guid | string, aggregateRootId: AggregateRootId, expectedAggregateRootVersion: AggregateRootVersion, ...events: UncommittedAggregateEvent[]): UncommittedAggregateEvents {
        return new UncommittedAggregateEvents(EventSourceId.from(eventSourceId), aggregateRootId, expectedAggregateRootVersion, ...events);
    }

    /**
     * Convert uncommitted aggregate events to an array.
     * @returns {UncommittedAggregateEvent[]} Array of committed events.
     */
    toArray(): UncommittedAggregateEvent[] {
        return [...this._events];
    }

    private throwIfEventContentIsNullOrUndefined(event: UncommittedAggregateEvent) {
        if (!event.content) {
            throw new EventContentNeedsToBeDefined();
        }
    }
}

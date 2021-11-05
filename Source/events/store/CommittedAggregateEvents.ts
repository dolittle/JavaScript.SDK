// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { AggregateRootId, AggregateRootVersion, EventSourceId } from '../index';
import { AggregateRootVersionIsOutOfOrder } from './AggregateRootVersionIsOutOfOrder';
import { CommittedAggregateEvent } from './CommittedAggregateEvent';
import { CommittedEvent } from './CommittedEvent';
import { EventContentNeedsToBeDefined } from './EventContentNeedsToBeDefined';
import { EventLogSequenceNumberIsOutOfOrder } from './EventLogSequenceNumberIsOutOfOrder';
import { EventWasAppliedByOtherAggregateRoot } from './EventWasAppliedByOtherAggregateRoot';
import { EventWasAppliedToOtherEventSource } from './EventWasAppliedToOtherEventSource';

/**
 * Represents a collection of committed events.
 *
 * @summary This type implements Iterable<CommittedEvent> and can be used for iterations directly.
 */
export class CommittedAggregateEvents implements Iterable<CommittedAggregateEvent> {
    private _events: CommittedAggregateEvent[] = [];
    private _nextAggregateRootVersion: AggregateRootVersion = AggregateRootVersion.initial;

    /**
     * Creates an instance of {@link CommittedAggregateEvents}.
     * @param {...CommittedEvent[]} events Events to initialize with.
     */
    constructor(readonly eventSourceId: EventSourceId, readonly aggregateRootId: AggregateRootId, ...events: CommittedAggregateEvent[]) {
        events.forEach((event, eventIndex) => {
            if (eventIndex === 0) {
                this._nextAggregateRootVersion = event.aggregateRootVersion;
            } else {
                this.throwIfEventLogVersionIsOutOfOrder(event, events[eventIndex - 1]);
            }

            this.throwIfEventContentIsNullOrUndefined(event);
            this.throwIfEventWasAppliedToOtherEventSource(event);
            this.throwIfEventWasAppliedByOtherAggreateRoot(event);
            this.throwIfAggregateRootVersionIsOutOfOrder(event);
            this._nextAggregateRootVersion = this._nextAggregateRootVersion.next();
        });

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
    [Symbol.iterator](): Iterator<CommittedAggregateEvent> {
        return this._events[Symbol.iterator]();
    }

    /**
     * Convert committed events to an array.
     * @returns {CommittedEvent[]} Array of committed events.
     */
    toArray(): CommittedEvent[] {
        return [...this._events];
    }

    /**
     * Gets the {@link AggregateRootVersion} of the aggregate root after all the events was applied.
     *
     * @returns {AggregateRootVersion}
     */
    get aggregateRootVersion(): AggregateRootVersion {
        return this._events.length === 0 ? AggregateRootVersion.initial : this._events[this._events.length - 1].aggregateRootVersion;
    }


    private throwIfEventLogVersionIsOutOfOrder(event: CommittedAggregateEvent, previousEvent: CommittedAggregateEvent) {
        if (event.eventLogSequenceNumber.value <= previousEvent.eventLogSequenceNumber.value) {
            throw new EventLogSequenceNumberIsOutOfOrder(event.eventLogSequenceNumber, previousEvent.eventLogSequenceNumber);
        }
    }

    private throwIfAggregateRootVersionIsOutOfOrder(event: CommittedAggregateEvent) {
        if (event.aggregateRootVersion.value !== this._nextAggregateRootVersion.value) {
            throw new AggregateRootVersionIsOutOfOrder(event.aggregateRootVersion, this._nextAggregateRootVersion);
        }
    }

    private throwIfEventWasAppliedByOtherAggreateRoot(event: CommittedAggregateEvent) {
        if (!event.aggregateRootId.equals(this.aggregateRootId)) {
            throw new EventWasAppliedByOtherAggregateRoot(event.aggregateRootId, this.aggregateRootId);
        }
    }

    private throwIfEventWasAppliedToOtherEventSource(event: CommittedAggregateEvent) {
        if (!event.eventSourceId.equals(this.eventSourceId)) {
            throw new EventWasAppliedToOtherEventSource(event.eventSourceId, this.eventSourceId);
        }
    }

    private throwIfEventContentIsNullOrUndefined(event: CommittedAggregateEvent) {
        if (!event.content) {
            throw new EventContentNeedsToBeDefined();
        }
    }
}

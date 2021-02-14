// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { AggregateRootId } from './AggregateRootId';
import { AggregateRootVersion } from './AggregateRootVersion';
import { EventSourceId } from './EventSourceId';
import { UncommittedAggregateEvent } from './UncommittedAggregateEvent';
import { EventContentNeedsToBeDefined } from './EventContentNeedsToBeDefined';

/**
 * Represents a sequence of {@link UncommittedAggregateEvent}s that have not been committed to the Event Store.
 */
export class UncommittedAggregateEvents implements Iterable<UncommittedAggregateEvent> {
    private _events: UncommittedAggregateEvent[] = [];

    /**
     * Creates an instance of {@link UncommittedAggregateEvents}.
     */
    constructor(readonly eventSourceId: EventSourceId, readonly aggregateRootId: AggregateRootId, readonly expectedAggregateRootVersion: AggregateRootVersion) {
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

    private throwIfEventContentIsNullOrUndefined(event: UncommittedAggregateEvent) {
        if (!event.content) {
            throw new EventContentNeedsToBeDefined();
        }
    }
}

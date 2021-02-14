// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IEventTypes } from '@dolittle/sdk.artifacts';
import { Logger } from 'winston';
import { AggregateRootId } from './AggregateRootId';
import { IEventStore } from './IEventStore';
import { EventSourceId } from './EventSourceId';
import { AggregateRootVersion } from './AggregateRootVersion';
import { CommittedAggregateEvents } from './CommittedAggregateEvents';
import { UncommittedAggregateEvent } from './UncommittedAggregateEvent';
import { UncommittedAggregateEvents } from './UncommittedAggregateEvents';

/**
 * Represents the builder for an aggregate event commit
 */
export class CommitForAggregateWithEventSourceAndExpectedVersionBuilder {
    constructor(
        private readonly _eventStore: IEventStore,
        private readonly _eventTypes: IEventTypes,
        private readonly _aggregateRootId: AggregateRootId,
        private readonly _eventSourceId: EventSourceId,
        private readonly _expectedVersion: AggregateRootVersion,
        private readonly _logger: Logger) {
    }

    /**
     * Commits uncommitted aggregate events to the Event Store
     * @param {UncommittedAggregateEvent[]} uncommittedEvents Uncommitted events.
     * @returns {Promise<CommittedAggregateEvents>}
     */
    async commit(uncommittedEvents: UncommittedAggregateEvent[]): Promise<CommittedAggregateEvents> {
        const uncommittedAggregateEvents = new UncommittedAggregateEvents(
            this._eventSourceId,
            this._aggregateRootId,
            this._expectedVersion
        );
        uncommittedEvents.forEach(_ => uncommittedAggregateEvents.add(_));
        this._eventStore.commitForAggregate(uncommittedAggregateEvents);
        return new CommittedAggregateEvents(this._eventSourceId, this._aggregateRootId, ...[]);
    }
}


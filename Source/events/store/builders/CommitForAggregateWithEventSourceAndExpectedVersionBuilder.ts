// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';
import { AggregateRootId, AggregateRootVersion, EventSourceId, IEventTypes } from '../../index';
import { CommittedAggregateEvents, IEventStore, UncommittedAggregateEvent, UncommittedAggregateEvents } from '../index';

/**
 * Represents the builder for an aggregate event commit.
 */
export class CommitForAggregateWithEventSourceAndExpectedVersionBuilder {
    /**
     * Initialises a new instance of the {@link CommitForAggregateWithEventSourceAndExpectedVersionBuilder} class.
     * @param {IEventStore} _eventStore - The event store to use for committing events.
     * @param {IEventTypes} _eventTypes - All registered event types.
     * @param {AggregateRootId} _aggregateRootId - The aggregate root type identifier to commit events for.
     * @param {EventSourceId} _eventSourceId - The aggeraget root event source id to commit events for.
     * @param {AggregateRootVersion} _expectedVersion - The aggregate root version to commit events for.
     * @param {Logger} _logger - The logger to use for logging.
     */
    constructor(
        private readonly _eventStore: IEventStore,
        private readonly _eventTypes: IEventTypes,
        private readonly _aggregateRootId: AggregateRootId,
        private readonly _eventSourceId: EventSourceId,
        private readonly _expectedVersion: AggregateRootVersion,
        private readonly _logger: Logger) {
    }

    /**
     * Commits uncommitted aggregate events to the Event Store.
     * @param {UncommittedAggregateEvent[]} uncommittedEvents - Uncommitted events.
     * @returns {Promise<CommittedAggregateEvents>} A {@link Promise} that when resolved returns the committed aggreagate events.
     */
    async commit(uncommittedEvents: UncommittedAggregateEvent[]): Promise<CommittedAggregateEvents> {
        const uncommittedAggregateEvents = new UncommittedAggregateEvents(
            this._eventSourceId,
            this._aggregateRootId,
            this._expectedVersion
        );
        uncommittedEvents.forEach(_ => uncommittedAggregateEvents.add(_));
        const result = await this._eventStore.commitForAggregate(uncommittedAggregateEvents);
        return result.events;
    }
}

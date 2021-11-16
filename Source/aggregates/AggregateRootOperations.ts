// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';
import { AggregateRootVersion, CommittedAggregateEvents, EventSourceId, IEventStore, IEventTypes, UncommittedAggregateEvent } from '@dolittle/sdk.events';
import { Constructor } from '@dolittle/types';
import { Cancellation } from '@dolittle/sdk.resilience';
import { AggregateRoot } from './AggregateRoot';
import { AggregateRootAction } from './AggregateRootAction';
import { AggregateRootTypesFromDecorators } from './AggregateRootTypesFromDecorators';
import { IAggregateRootOperations } from './IAggregateRootOperations';

/**
 * Represents an implementation of {@link IAggregateRootOperations<TAggregate>}.
 * @template TAggregateRoot
 */
export class AggregateRootOperations<TAggregateRoot extends AggregateRoot> extends IAggregateRootOperations<TAggregateRoot> {
    /**
     * Initialises a new instance of the {@link AggregateRootOperations} class.
     * @param {EventSourceId} _eventSourceId - The event source id of the aggregate root to perform operations on.
     * @param {IEventStore} _eventStore - The event store to fetch committed events from and commit aggregate events with.
     * @param {Constructor<TAggregateRoot>} _aggregateRootType - The type of the aggregate root implementation.
     * @param {IEventTypes} _eventTypes - All registered event types.
     * @param {Logger} _logger - The logger to use for logging.
     */
    constructor(
        private readonly _eventSourceId: EventSourceId,
        private readonly _eventStore: IEventStore,
        private readonly _aggregateRootType: Constructor<TAggregateRoot>,
        private readonly _eventTypes: IEventTypes,
        private readonly _logger: Logger) {
        super();
    }

    /** @inheritdoc */
    async perform(action: AggregateRootAction<TAggregateRoot>, cancellation: Cancellation = Cancellation.default): Promise<void> {
        const aggregateRoot = new this._aggregateRootType(this._eventSourceId);
        const aggregateRootId = AggregateRootTypesFromDecorators.aggregateRootTypes.getFor(this._aggregateRootType).id;
        aggregateRoot.aggregateRootId = aggregateRootId;
        aggregateRoot.eventTypes = this._eventTypes;
        this._logger.debug(
            `Performing operation on ${this._aggregateRootType.name} with aggregate root id ${aggregateRootId} applying events to event source ${aggregateRoot.eventSourceId}`,
            this._aggregateRootType,
            aggregateRootId,
            aggregateRoot.eventSourceId);
        await this.reApplyEvents(aggregateRoot, cancellation);
        await action(aggregateRoot);
        if (aggregateRoot.appliedEvents.length > 0) {
            await this.commitAppliedEvents(aggregateRoot);
        }
    }

    private commitAppliedEvents(aggregateRoot: TAggregateRoot): Promise<CommittedAggregateEvents> {
        const aggregateRootId = aggregateRoot.aggregateRootId;
        this._logger.debug(
            `${this._aggregateRootType.name} with aggregate root id ${aggregateRootId} is committing ${aggregateRoot.appliedEvents.length} events to the event source ${aggregateRoot.eventSourceId}`,
            this._aggregateRootType,
            aggregateRootId,
            aggregateRoot.appliedEvents.length,
            this._eventSourceId);

        return this._eventStore
            .forAggregate(aggregateRootId)
            .withEventSource(aggregateRoot.eventSourceId)
            .expectVersion(AggregateRootVersion.from(aggregateRoot.version.value - aggregateRoot.appliedEvents.length))
            .commit(this.getUncommittedAggregateEvents(aggregateRoot));
    }

    private getUncommittedAggregateEvents(aggregateRoot: TAggregateRoot): UncommittedAggregateEvent[] {
        return aggregateRoot.appliedEvents.map(_ => {
            const uncommitted: UncommittedAggregateEvent = {
                content: _.event,
                eventType: _.hasEventType ? _.eventType : this._eventTypes.getFor(_.event.constructor),
                public: _.isPublic
            };
            return uncommitted;
        });
    }

    private async reApplyEvents(aggregateRoot: TAggregateRoot, cancellation: Cancellation) {
        const eventSourceId = aggregateRoot.eventSourceId;

        this._logger.debug(
            `Re-applying events for ${this._aggregateRootType.name} with aggregate root id ${aggregateRoot.aggregateRootId} with event source id ${eventSourceId}`,
            this._aggregateRootType,
            aggregateRoot.aggregateRootId,
            eventSourceId
        );

        const committedEvents = await this._eventStore.fetchForAggregate(aggregateRoot.aggregateRootId, eventSourceId, cancellation);
        if (committedEvents.hasEvents) {
            this._logger.debug(`Re-applying ${committedEvents.length}`, committedEvents.length);
            aggregateRoot.reApply(committedEvents);
        } else {
            this._logger.debug('No events to re-apply');
        }
    }

}

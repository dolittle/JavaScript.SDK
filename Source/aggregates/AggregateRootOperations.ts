// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';
import { Constructor } from '@dolittle/types';

import { AggregateRootVersion, CommittedAggregateEvents, EventSourceId, IEventStore, IEventTypes, UncommittedAggregateEvent } from '@dolittle/sdk.events';
import { Cancellation } from '@dolittle/sdk.resilience';

import { AggregateRoot } from './AggregateRoot';
import { AggregateRootAction } from './AggregateRootAction';
import { IAggregateRootOperations } from './IAggregateRootOperations';
import { AggregateRootType } from './AggregateRootType';

/**
 * Represents an implementation of {@link IAggregateRootOperations<TAggregate>}.
 * @template TAggregateRoot
 */
export class AggregateRootOperations<TAggregateRoot extends AggregateRoot> extends IAggregateRootOperations<TAggregateRoot> {
    /**
     * Initialises a new instance of the {@link AggregateRootOperations} class.
     * @param {Constructor<TAggregateRoot>} _type - The class implementing the aggregate root.
     * @param {AggregateRootType} _aggregateRootType - The aggregate root type associated with the aggregate root.
     * @param {EventSourceId} _eventSourceId - The event source id of the aggregate root to perform operations on.
     * @param {IEventStore} _eventStore - The event store to fetch committed events from and commit aggregate events with.
     * @param {IEventTypes} _eventTypes - All registered event types.
     * @param {Logger} _logger - The logger to use for logging.
     */
    constructor(
        private readonly _type: Constructor<TAggregateRoot>,
        private readonly _aggregateRootType: AggregateRootType,
        private readonly _eventSourceId: EventSourceId,
        private readonly _eventStore: IEventStore,
        private readonly _eventTypes: IEventTypes,
        private readonly _logger: Logger) {
        super();
    }

    /** @inheritdoc */
    async perform(action: AggregateRootAction<TAggregateRoot>, cancellation: Cancellation = Cancellation.default): Promise<void> {
        const instance = new this._type(this._eventSourceId);
        instance.aggregateRootId = this._aggregateRootType.id;
        instance.eventTypes = this._eventTypes;

        this._logger.debug(
            `Performing operation on ${this._type.name} with aggregate root id ${this._aggregateRootType.id} applying events to event source ${this._eventSourceId}`,
            this._type,
            this._aggregateRootType,
            this._eventSourceId);

        await this.reApplyEvents(instance, cancellation);

        await action(instance);

        if (instance.appliedEvents.length > 0) {
            await this.commitAppliedEvents(instance);
        }
    }

    private commitAppliedEvents(instance: TAggregateRoot): Promise<CommittedAggregateEvents> {
        this._logger.debug(
            `${this._type.name} with aggregate root id ${this._aggregateRootType.id} is committing ${instance.appliedEvents.length} events to the event source ${this._eventSourceId}`,
            this._type,
            this._aggregateRootType,
            instance.appliedEvents.length,
            this._eventSourceId);

        return this._eventStore
            .forAggregate(this._aggregateRootType.id)
            .withEventSource(this._eventSourceId)
            .expectVersion(AggregateRootVersion.from(instance.version.value - instance.appliedEvents.length))
            .commit(this.getUncommittedAggregateEvents(instance));
    }

    private getUncommittedAggregateEvents(instance: TAggregateRoot): UncommittedAggregateEvent[] {
        return instance.appliedEvents.map(_ => {
            const uncommitted: UncommittedAggregateEvent = {
                content: _.event,
                eventType: _.hasEventType ? _.eventType : this._eventTypes.getFor(_.event.constructor),
                public: _.isPublic
            };
            return uncommitted;
        });
    }

    private async reApplyEvents(instance: TAggregateRoot, cancellation: Cancellation) {
        this._logger.debug(
            `Re-applying events for ${this._type.name} with aggregate root id ${this._aggregateRootType.id} with event source id ${this._eventSourceId}`,
            this._type,
            this._aggregateRootType,
            this._eventSourceId);

        const committedEvents = await this._eventStore.fetchForAggregate(this._aggregateRootType.id, this._eventSourceId, cancellation);
        if (committedEvents.hasEvents) {
            this._logger.debug(`Re-applying ${committedEvents.length}`, committedEvents.length);
            instance.reApply(committedEvents);
        } else {
            this._logger.debug('No events to re-apply');
        }
    }
}

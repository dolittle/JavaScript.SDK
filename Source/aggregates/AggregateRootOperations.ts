// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IAggregateRootOperations } from './IAggregateRootOperations';
import { AggregateRootAction } from './AggregateRootAction';
import { AggregateRoot } from './AggregateRoot';
import { AggregateRootVersion, AggregateRootId, CommittedAggregateEvents, IEventStore, UncommittedAggregateEvent, IEventTypes } from '@dolittle/sdk.events';
import { Logger } from 'winston';
import { Constructor } from '@dolittle/types';


/**
 * Represents an implementation of {@link IAggregateRootOperations<TAggregate>}
 * @template TAggregateRoot
 */
export class AggregateRootOperations<TAggregateRoot extends AggregateRoot> implements IAggregateRootOperations<TAggregateRoot> {
    constructor(
        private readonly _aggregateRootType: Constructor<any>,
        private readonly _eventStore: IEventStore,
        private readonly _aggregateRoot: TAggregateRoot,
        private readonly _eventTypes: IEventTypes,
        private readonly _logger: Logger) {
    }

    /** @inheritdoc */
    async perform(action: AggregateRootAction<TAggregateRoot>): Promise<void> {
        const aggregateRootId = this._aggregateRoot.aggregateRootId;
        this._logger.debug(
            `Performing operation on ${this._aggregateRootType.name} with aggregate root id ${aggregateRootId} applying events to event source ${this._aggregateRoot.eventSourceId}`,
            this._aggregateRootType,
            aggregateRootId,
            this._aggregateRoot.eventSourceId);

        await action(this._aggregateRoot);
        if (this._aggregateRoot.appliedEvents.length > 0) {
            await this.commitAppliedEvents(aggregateRootId);
        }
    }

    private async commitAppliedEvents(aggregateRootId: AggregateRootId): Promise<CommittedAggregateEvents> {

        this._logger.debug(
            `${this._aggregateRootType.name} with aggregate root id ${aggregateRootId} is committing ${this._aggregateRoot.appliedEvents.length} events to the event source ${this._aggregateRoot.eventSourceId}`,
            this._aggregateRootType,
            aggregateRootId,
            this._aggregateRoot.appliedEvents.length,
            this._aggregateRoot.eventSourceId);

        return this._eventStore
            .forAggregate(aggregateRootId)
            .withEventSource(this._aggregateRoot.eventSourceId)
            .expectVersion(AggregateRootVersion.from(this._aggregateRoot.version.value - this._aggregateRoot.appliedEvents.length))
            .commit(this.getUncommittedAggregateEvents());
    }

    private getUncommittedAggregateEvents(): UncommittedAggregateEvent[] {
        return this._aggregateRoot.appliedEvents.map(_ => {
            const uncommitted: UncommittedAggregateEvent = {
                content: _.event,
                eventType: _.hasEventType ? _.eventType : this._eventTypes.getFor(_.event.constructor),
                public: _.isPublic
            };
            return uncommitted;
        });
    }
}

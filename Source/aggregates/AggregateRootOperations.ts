// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { AggregateRootId, AggregateRootVersion, AggregateRootVersionIsOutOfOrder, CommittedAggregateEvent, CommittedAggregateEvents, EventTypeId, EventWasAppliedByOtherAggregateRoot, EventWasAppliedToOtherEventSource, IEventStore, IEventTypes, UncommittedAggregateEvent } from '@dolittle/sdk.events';
import { Cancellation } from '@dolittle/sdk.resilience';
import { Constructor } from '@dolittle/types';
import { Logger } from 'winston';
import { AggregateRoot } from './AggregateRoot';
import { AggregateRootAction } from './AggregateRootAction';
import { AggregateRootTypesFromDecorators } from './AggregateRootTypesFromDecorators';
import { IAggregateRootOperations } from './IAggregateRootOperations';
import { OnDecoratedMethod } from './OnDecoratedMethod';
import { OnDecoratedMethods } from './OnDecoratedMethods';


/**
 * Represents an implementation of {@link IAggregateRootOperations<TAggregate>}
 * @template TAggregateRoot
 */
export class AggregateRootOperations<TAggregateRoot extends AggregateRoot> extends IAggregateRootOperations<TAggregateRoot> {
    constructor(
        private readonly _aggregateRootType: Constructor<any>,
        private readonly _eventStore: IEventStore,
        private readonly _aggregateRoot: TAggregateRoot,
        private readonly _eventTypes: IEventTypes,
        private readonly _logger: Logger) {
        super();
    }

    /** @inheritdoc */
    async perform(action: AggregateRootAction<TAggregateRoot>, cancellation: Cancellation = Cancellation.default): Promise<void> {
        const aggregateRootId = this._aggregateRoot.aggregateRootId;
        this._logger.debug(
            `Performing operation on ${this._aggregateRootType.name} with aggregate root id ${aggregateRootId} applying events to event source ${this._aggregateRoot.eventSourceId}`,
            this._aggregateRootType,
            aggregateRootId,
            this._aggregateRoot.eventSourceId);
        await this.reApplyEvents(cancellation);
        await action(this._aggregateRoot);
        if (this._aggregateRoot.appliedEvents.length > 0) {
            await this.commitAppliedEvents(aggregateRootId);
        }
    }

    private commitAppliedEvents(aggregateRootId: AggregateRootId): Promise<CommittedAggregateEvents> {
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


    private async reApplyEvents(cancellation: Cancellation) {
        const eventSourceId = this._aggregateRoot.eventSourceId;
        const aggregateRootId = AggregateRootTypesFromDecorators.aggregateRootTypes.getFor(this._aggregateRootType).id;
        this._aggregateRoot.aggregateRootId = aggregateRootId;

        this._logger.debug(
            `Re-applying events for ${this._aggregateRootType.name} with aggregate root id ${aggregateRootId} with event source id ${eventSourceId}`,
            this._aggregateRootType,
            aggregateRootId,
            eventSourceId
        );

        const committedEvents = await this._eventStore.fetchForAggregate(aggregateRootId, eventSourceId, cancellation);
        if (committedEvents.hasEvents) {
            this._logger.silly(`Re-applying ${committedEvents.length}`, committedEvents.length);

            this.throwIfEventWasAppliedToOtherEventSource(committedEvents);
            this.throwIfEventWasAppliedByOtherAggreateRoot(committedEvents);

            let onMethods: OnDecoratedMethod[] = [];
            const hasState = OnDecoratedMethods.methodsPerAggregate.has(this._aggregateRootType);
            if (hasState) {
                onMethods = OnDecoratedMethods.methodsPerAggregate.get(this._aggregateRootType)!;
            }

            for (const event of committedEvents) {
                this.throwIfAggregateRootVersionIsOutOfOrder(event);
                this._aggregateRoot.nextVersion();
                if (hasState) {
                    const onMethod = onMethods.find(_ => {
                        let eventTypeId = EventTypeId.from(Guid.empty);
                        if (_.eventTypeOrId instanceof Function) {
                            eventTypeId = this._eventTypes.getFor(_.eventTypeOrId).id;
                        } else {
                            eventTypeId = EventTypeId.from(_.eventTypeOrId);
                        }

                        return eventTypeId.equals(event.type.id);
                    });

                    if (onMethod) {
                        onMethod.method.call(this._aggregateRoot, event.content);
                    }
                }
            }
        } else {
            this._logger.silly('No events to re-apply');
        }
    }


    private throwIfAggregateRootVersionIsOutOfOrder(event: CommittedAggregateEvent) {
        if (event.aggregateRootVersion.value !== this._aggregateRoot.version.value) {
            throw new AggregateRootVersionIsOutOfOrder(event.aggregateRootVersion, this._aggregateRoot.version);
        }
    }

    private throwIfEventWasAppliedByOtherAggreateRoot(event: CommittedAggregateEvents) {
        if (!event.aggregateRootId.equals(this._aggregateRoot.aggregateRootId)) {
            throw new EventWasAppliedByOtherAggregateRoot(event.aggregateRootId, this._aggregateRoot.aggregateRootId);
        }
    }

    private throwIfEventWasAppliedToOtherEventSource(event: CommittedAggregateEvents) {
        if (!event.eventSourceId.equals(this._aggregateRoot.eventSourceId)) {
            throw new EventWasAppliedToOtherEventSource(event.eventSourceId, this._aggregateRoot.eventSourceId);
        }
    }
}

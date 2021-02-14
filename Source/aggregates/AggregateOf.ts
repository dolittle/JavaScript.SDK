// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { AggregateRootVersionIsOutOfOrder, CommittedAggregateEvent, CommittedAggregateEvents, EventSourceId, EventWasAppliedByOtherAggregateRoot, EventWasAppliedToOtherEventSource, IEventStore } from '@dolittle/sdk.events';
import { IAggregateOf } from './IAggregateOf';
import { IAggregateRootOperations } from './IAggregateRootOperations';
import { EventTypeId, IEventTypes } from '@dolittle/sdk.artifacts';
import { Logger } from 'winston';
import { Constructor } from '@dolittle/types';
import { AggregateRootOperations } from './AggregateRootOperations';
import { AggregateRoot } from './AggregateRoot';
import { AggregateRootDecoratedTypes } from './AggregateRootDecoratedTypes';
import { OnDecoratedMethods } from './OnDecoratedMethods';
import { OnDecoratedMethod } from './OnDecoratedMethod';
import { Guid } from '@dolittle/rudiments';

/**
 * Represents an implementation of {@link IAggregateOf<TAggregateRoot>}.
 * @template TAggregateRoot
 */
export class AggregateOf<TAggregateRoot extends AggregateRoot> implements IAggregateOf<TAggregateRoot> {

    constructor(
        private readonly _type: Constructor<TAggregateRoot>,
        private readonly _eventStore: IEventStore,
        private readonly _eventTypes: IEventTypes,
        private readonly _logger: Logger) {
    }

    /** @inheritdoc */
    create(): IAggregateRootOperations<TAggregateRoot> {
        return this.get(EventSourceId.new());
    }

    /** @inheritdoc */
    get(eventSourceId: EventSourceId): IAggregateRootOperations<TAggregateRoot> {
        const aggregateRoot = new this._type(eventSourceId);
        this.reApplyEvents(aggregateRoot);
        const operations = new AggregateRootOperations<TAggregateRoot>(
            this._type,
            this._eventStore,
            aggregateRoot,
            this._eventTypes,
            this._logger);
        return operations;
    }

    private reApplyEvents(aggregateRoot: TAggregateRoot) {
        const eventSourceId = aggregateRoot.eventSourceId;
        const aggregateRootId = AggregateRootDecoratedTypes.getFor(this._type).aggregateRootId;
        aggregateRoot.aggregateRootId = aggregateRootId;

        this._logger.debug(
            `Re-applying events for ${this._type.name} with aggregate root id ${aggregateRootId} with event source id ${eventSourceId}`,
            this._type,
            aggregateRootId,
            eventSourceId
        );

        const committedEvents = this._eventStore.fetchForAggregateSync(aggregateRootId, eventSourceId);
        if (committedEvents.hasEvents) {
            this._logger.silly(`Re-applying ${committedEvents.length}`, committedEvents.length);

            this.throwIfEventWasAppliedToOtherEventSource(aggregateRoot, committedEvents);
            this.throwIfEventWasAppliedByOtherAggreateRoot(aggregateRoot, committedEvents);

            let onMethods: OnDecoratedMethod[] = [];
            const hasState = OnDecoratedMethods.methodsPerAggregate.has(this._type);
            if (hasState) {
                onMethods = OnDecoratedMethods.methodsPerAggregate.get(this._type)!;
            }

            for (const event of committedEvents) {
                this.throwIfAggregateRootVersionIsOutOfOrder(aggregateRoot, event);
                aggregateRoot.nextVersion();
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
                        onMethod.method(event.content);
                    }
                }
            }
        } else {
            this._logger.silly('No events to re-apply');
        }
    }

    private throwIfAggregateRootVersionIsOutOfOrder(aggregateRoot: AggregateRoot, event: CommittedAggregateEvent) {
        if (event.aggregateRootVersion.value !== aggregateRoot.version.value) {
            throw new AggregateRootVersionIsOutOfOrder(event.aggregateRootVersion, aggregateRoot.version);
        }
    }

    private throwIfEventWasAppliedByOtherAggreateRoot(aggregateRoot: AggregateRoot, event: CommittedAggregateEvents) {
        if (!event.aggregateRootId.equals(aggregateRoot.aggregateRootId)) {
            throw new EventWasAppliedByOtherAggregateRoot(event.aggregateRootId, aggregateRoot.aggregateRootId);
        }
    }

    private throwIfEventWasAppliedToOtherEventSource(aggregateRoot: AggregateRoot, event: CommittedAggregateEvents) {
        if (!event.eventSourceId.equals(aggregateRoot.eventSourceId)) {
            throw new EventWasAppliedToOtherEventSource(event.eventSourceId, aggregateRoot.eventSourceId);
        }
    }

}
// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { CommittedAggregateEvents, EventSourceId, IEventStore } from '@dolittle/sdk.events';
import { IAggregateOf } from './IAggregateOf';
import { IAggregateRootOperations } from './IAggregateRootOperations';
import { IEventTypes } from '@dolittle/sdk.artifacts';
import { Logger } from 'winston';
import { Constructor } from '@dolittle/types';
import { AggregateRootOperations } from './AggregateRootOperations';
import { AggregateRoot } from './AggregateRoot';
import { AggregateRootDecoratedTypes } from './AggregateRootDecoratedTypes';

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

        //throw new Error('Not implemented');
        /*
        const committedEvents: CommittedAggregateEvents = this._eventStore.fetchForAggregate(aggregateRootId, eventSourceId);
        if (committedEvents.hasEvents) {
            this._logger.silly(`Re-applying ${committedEvents.length}`, committedEvents.length);
            aggregateRoot.reApply(committedEvents);
        } else {
            this._logger.silly('No events to re-apply');
        }*/
    }
}
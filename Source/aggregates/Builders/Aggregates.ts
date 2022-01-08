// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';
import { Constructor } from '@dolittle/types';

import { EventSourceId, EventSourceIdLike, IEventStore, IEventTypes } from '@dolittle/sdk.events';

import { AggregateOf } from '../AggregateOf';
import { AggregateRoot } from '../AggregateRoot';
import { AggregateRootOperations } from '../AggregateRootOperations';
import { IAggregateOf } from '../IAggregateOf';
import { IAggregateRootTypes } from '../IAggregateRootTypes';
import { IAggregateRootOperations } from '../IAggregateRootOperations';
import { IAggregates } from './IAggregates';

/**
 * Represents an implementation of {@link IAggregates}.
 */
export class Aggregates extends IAggregates {
    /**
     * Initialises a new instance of the {@link Aggregates} class.
     * @param {IAggregateRootTypes} _aggregateRootTypes - For aggregate root types resolution.
     * @param {IEventTypes} _eventTypes - For event types resolution.
     * @param {IEventStore} _eventStore - The event store to use to fetch committed aggregate events.
     * @param {Logger} _logger - For logging.
     */
    constructor(
        private readonly _aggregateRootTypes: IAggregateRootTypes,
        private readonly _eventTypes: IEventTypes,
        private readonly _eventStore: IEventStore,
        private readonly _logger: Logger,
    ) {
        super();
    }

    /** @inheritdoc */
    get<TAggregateRoot extends AggregateRoot>(type: Constructor<TAggregateRoot>, eventSourceId: EventSourceIdLike): IAggregateRootOperations<TAggregateRoot> {
        return new AggregateRootOperations<TAggregateRoot>(
            type,
            this._aggregateRootTypes.getFor(type),
            EventSourceId.from(eventSourceId),
            this._eventStore,
            this._eventTypes,
            this._logger);
    }

    /** @inheritdoc */
    of<TAggregateRoot extends AggregateRoot>(type: Constructor<TAggregateRoot>): IAggregateOf<TAggregateRoot> {
        return new AggregateOf<TAggregateRoot>(
            type,
            this._aggregateRootTypes.getFor(type),
            this._eventStore,
            this._eventTypes,
            this._logger);
    }
}

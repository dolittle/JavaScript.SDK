// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';
import { Constructor } from '@dolittle/types';

import { EventSourceId, IEventStore, IEventTypes } from '@dolittle/sdk.events';

import { AggregateOf, AggregateRoot, AggregateRootOperations, IAggregateOf, IAggregateRootOperations } from '..';
import { IAggregates } from './IAggregates';

/**
 * Represents an implementation of {@link IAggregates}.
 */
export class Aggregates extends IAggregates {
    /**
     * Initialises a new instance of the {@link Aggregates} class.
     * @param {IEventStore} _eventStore - The event store to use to fetch committed aggregate events.
     * @param {IEventTypes} _eventTypes - For event types resolution.
     * @param {Logger} _logger - For logging.
     */
    constructor(
        private readonly _eventStore: IEventStore,
        private readonly _eventTypes: IEventTypes,
        private readonly _logger: Logger,
    ) {
        super();
    }

    /** @inheritdoc */
    get<TAggregateRoot extends AggregateRoot>(type: Constructor<TAggregateRoot>, eventSourceId: EventSourceId): IAggregateRootOperations<TAggregateRoot> {
        return new AggregateRootOperations<TAggregateRoot>(eventSourceId, this._eventStore, type, this._eventTypes, this._logger);
    }

    /** @inheritdoc */
    of<TAggregateRoot extends AggregateRoot>(type: Constructor<TAggregateRoot>): IAggregateOf<TAggregateRoot> {
        return new AggregateOf<TAggregateRoot>(type, this._eventStore, this._eventTypes, this._logger);
    }
}

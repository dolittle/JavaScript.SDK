// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';
import { Constructor } from '@dolittle/types';

import { EventSourceId, IEventStore, IEventTypes } from '@dolittle/sdk.events';

import { AggregateRoot } from './AggregateRoot';
import { AggregateRootOperations } from './AggregateRootOperations';
import { IAggregateOf } from './IAggregateOf';
import { IAggregateRootOperations } from './IAggregateRootOperations';

/**
 * Represents an implementation of {@link IAggregateOf<TAggregateRoot>}.
 * @template TAggregateRoot
 */
export class AggregateOf<TAggregateRoot extends AggregateRoot> extends IAggregateOf<TAggregateRoot> {

    /**
     * Initialises a new instance of the {@link AggregateOf} class.
     * @param {Constructor<TAggregateRoot>} _type - The type of the aggregate root implementation.
     * @param {IEventStore} _eventStore - The event store to fetch committed events from and commit aggregate events with.
     * @param {IEventTypes} _eventTypes - All registered event types.
     * @param {Logger} _logger - The logger to use for logging.
     */
    constructor(
        private readonly _type: Constructor<TAggregateRoot>,
        private readonly _eventStore: IEventStore,
        private readonly _eventTypes: IEventTypes,
        private readonly _logger: Logger) {
        super();
    }

    /** @inheritdoc */
    create(): IAggregateRootOperations<TAggregateRoot> {
        return this.get(EventSourceId.new());
    }

    /** @inheritdoc */
    get(eventSourceId: EventSourceId): IAggregateRootOperations<TAggregateRoot> {
        return new AggregateRootOperations<TAggregateRoot>(eventSourceId, this._eventStore, this._type, this._eventTypes, this._logger);
    }
}

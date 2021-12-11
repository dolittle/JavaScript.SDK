// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';

import { AggregateRootId } from '../../AggregateRootId';
import { EventSourceId } from '../../EventSourceId';
import { IEventTypes } from '../../IEventTypes';
import { IEventStore } from '../IEventStore';
import { EventBuilderMethodAlreadyCalled } from './EventBuilderMethodAlreadyCalled';
import { CommitForAggregateWithEventSourceBuilder } from './CommitForAggregateWithEventSourceBuilder';

/**
 * Represents the builder for an aggregate event commit.
 */
export class CommitForAggregateBuilder {
    private _builder?: CommitForAggregateWithEventSourceBuilder;

    /**
     * Initialises a new instance of the {@link CommitForAggregateBuilder} class.
     * @param {IEventStore} _eventStore - The event store to use for committing events.
     * @param {IEventTypes} _eventTypes - All registered event types.
     * @param {AggregateRootId} _aggregateRootId - The aggregate root type identifier to commit events for.
     * @param {Logger} _logger - The logger to use for logging.
     */
    constructor(
        private readonly _eventStore: IEventStore,
        private readonly _eventTypes: IEventTypes,
        private readonly _aggregateRootId: AggregateRootId,
        private readonly _logger: Logger) {
    }

    /**
     * Build aggregate events with event source id.
     * @param {EventSourceId} eventSourceId - The {@link EventSourceId}.
     * @returns {CommitForAggregateWithEventSourceBuilder} For continuation.
     */
    withEventSource(eventSourceId: EventSourceId): CommitForAggregateWithEventSourceBuilder {
        if (this._builder) {
            throw new EventBuilderMethodAlreadyCalled('withEventSource');
        }
        this._builder = new CommitForAggregateWithEventSourceBuilder(
            this._eventStore,
            this._eventTypes,
            this._aggregateRootId,
            eventSourceId,
            this._logger
        );
        return this._builder;
    }
}

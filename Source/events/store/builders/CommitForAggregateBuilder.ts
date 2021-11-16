// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';
import { IEventStore } from '../index';
import { AggregateRootId, EventSourceId, IEventTypes } from '../../index';
import { EventBuilderMethodAlreadyCalled } from './EventBuilderMethodAlreadyCalled';
import { CommitForAggregateWithEventSourceBuilder } from './CommitForAggregateWithEventSourceBuilder';

/**
 * Represents the builder for an aggregate event commit.
 */
export class CommitForAggregateBuilder {
    private _builder?: CommitForAggregateWithEventSourceBuilder;

    /**
     * @param _eventStore
     * @param _eventTypes
     * @param _aggregateRootId
     * @param _logger
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

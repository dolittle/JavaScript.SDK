// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';
import { AggregateRootId, AggregateRootVersion, EventSourceId, IEventTypes } from '../../index';
import { IEventStore } from '../index';
import { EventBuilderMethodAlreadyCalled } from './EventBuilderMethodAlreadyCalled';
import { CommitForAggregateWithEventSourceAndExpectedVersionBuilder } from './CommitForAggregateWithEventSourceAndExpectedVersionBuilder';

/**
 * Represents the builder for an aggregate event commit.
 */
export class CommitForAggregateWithEventSourceBuilder {
    private _builder?: CommitForAggregateWithEventSourceAndExpectedVersionBuilder;

    /**
     * Initialises a new instance of the {@link CommitForAggregateWithEventSourceBuilder} class.
     * @param {IEventStore} _eventStore - The event store to use for committing events.
     * @param {IEventTypes} _eventTypes - All registered event types.
     * @param {AggregateRootId} _aggregateRootId - The aggregate root type identifier to commit events for.
     * @param {EventSourceId} _eventSourceId - The aggeraget root event source id to commit events for.
     * @param {Logger} _logger - The logger to use for logging.
     */
    constructor(
        private readonly _eventStore: IEventStore,
        private readonly _eventTypes: IEventTypes,
        private readonly _aggregateRootId: AggregateRootId,
        private readonly _eventSourceId: EventSourceId,
        private readonly _logger: Logger) {
    }

    /**
     * Configure the expected {@link AggregateRootVersion} for the {@link UncommittedAggregateEvents}.
     * @param {AggregateRootVersion} expectedVersion - Expected {@link AggregateRootVersion}.
     * @returns {CommitForAggregateWithEventSourceAndExpectedVersionBuilder} A builder with expected version to use for building aggregate event commit.
     */
    expectVersion(expectedVersion: AggregateRootVersion): CommitForAggregateWithEventSourceAndExpectedVersionBuilder {
        if (this._builder) {
            throw new EventBuilderMethodAlreadyCalled('expectVersion');
        }
        this._builder = new CommitForAggregateWithEventSourceAndExpectedVersionBuilder(
            this._eventStore,
            this._eventTypes,
            this._aggregateRootId,
            this._eventSourceId,
            expectedVersion,
            this._logger
        );
        return this._builder;
    }
}

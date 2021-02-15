// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IEventTypes } from '@dolittle/sdk.artifacts';
import { Logger } from 'winston';
import { AggregateRootId } from './AggregateRootId';
import { IEventStore } from './IEventStore';
import { EventSourceId } from './EventSourceId';
import { EventBuilderMethodAlreadyCalled } from './EventBuilderMethodAlreadyCalled';
import { AggregateRootVersion } from './AggregateRootVersion';
import { CommitForAggregateWithEventSourceAndExpectedVersionBuilder } from './CommitForAggregateWithEventSourceAndExpectedVersionBuilder';

/**
 * Represents the builder for an aggregate event commit
 */
export class CommitForAggregateWithEventSourceBuilder {
    private _builder?: CommitForAggregateWithEventSourceAndExpectedVersionBuilder;

    constructor(
        private readonly _eventStore: IEventStore,
        private readonly _eventTypes: IEventTypes,
        private readonly _aggregateRootId: AggregateRootId,
        private readonly _eventSourceId: EventSourceId,
        private readonly _logger: Logger) {
    }

    /**
     * Configure the expected {@link AggregateRootVersion} for the {@link UncommittedAggregateEvents}.
     * @param {AggregateRootVersion} expectedVersion Expected {@link AggregateRootVersion}.
     * @returns  {CommitForAggregateWithEventSourceAndExpectedVersionBuilder}
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

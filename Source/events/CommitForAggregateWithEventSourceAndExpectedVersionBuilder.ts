// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IEventTypes } from '@dolittle/sdk.artifacts';
import { Logger } from 'winston';
import { AggregateRootId } from './AggregateRootId';
import { IEventStore } from './IEventStore';
import { EventSourceId } from './EventSourceId';
import { AggregateRootVersion } from './AggregateRootVersion';
import { CommittedAggregateEvents } from './CommittedAggregateEvents';
import { UncommittedAggregateEvent } from './UncommittedAggregateEvent';

/**
 * Represents the builder for an aggregate event commit
 */
export class CommitForAggregateWithEventSourceAndExpectedVersionBuilder {
    constructor(
        private readonly _eventStore: IEventStore,
        private readonly _eventTypes: IEventTypes,
        private readonly _aggregateRootId: AggregateRootId,
        private readonly _eventSourceId: EventSourceId,
        private readonly _expectedVersion: AggregateRootVersion,
        private readonly _logger: Logger) {
    }

    async commit(uncommittedEvents: UncommittedAggregateEvent[]): Promise<CommittedAggregateEvents> {
        throw new Error('Not implemented');
    }
}


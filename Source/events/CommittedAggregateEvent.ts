// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { DateTime } from 'luxon';
import { EventType } from '@dolittle/sdk.artifacts';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { EventSourceId } from './EventSourceId';
import { EventLogSequenceNumber } from './EventLogSequenceNumber';
import { AggregateRootId } from './AggregateRootId';
import { AggregateRootVersion } from './AggregateRootVersion';
import { CommittedEvent } from './CommittedEvent';

/**
 * Represents an event that was applied to an Event Source by an Aggregate Root and is committed to the Event Store.
 */
export class CommittedAggregateEvent extends CommittedEvent {
    /**
     * Initializes a new instance of {@link CommittedEvent}.
     * @param {EventLogSequenceNumber} eventLogSequenceNumber The sequence number in the event log.
     * @param {DateTime} occurred Timestamp for when it occurred.
     * @param {EventSourceId} eventSourceId Identifier of the event source.
     * @param {AggregateRootId} aggregateRootId Identifier of the aggregate root.
     * @param {AggregateRootVersion} aggregateRootVersion The version of the aggregate root that applied the event.
     * @param {ExecutionContext} executionContext The execution context in which the event happened.
     * @param {EventType} type Type of event.
     * @param {*} content Actual content of the event.
     * @param {boolean} isPublic Whether or not the event is a public event.
     * @param {boolean} isExternal Whether or not the event is originating externally.
     * @param {number} externalEventLogSequenceNumber If external; the external event log sequence number.
     * @param {DateTime} externalEventReceived If external; timestamp for when it was received.
     */
    constructor(
        readonly eventLogSequenceNumber: EventLogSequenceNumber,
        readonly occurred: DateTime,
        readonly eventSourceId: EventSourceId,
        readonly aggregateRootId: AggregateRootId,
        readonly aggregateRootVersion: AggregateRootVersion,
        readonly executionContext: ExecutionContext,
        readonly type: EventType,
        readonly content: any,
        readonly isPublic: boolean,
        readonly isExternal: boolean,
        readonly externalEventLogSequenceNumber: EventLogSequenceNumber,
        readonly externalEventReceived: DateTime) {

        super(
            eventLogSequenceNumber,
            occurred,
            eventSourceId,
            executionContext,
            type,
            content,
            isPublic,
            isExternal,
            externalEventLogSequenceNumber,
            externalEventReceived);
    }
}


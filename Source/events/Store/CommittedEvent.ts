// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { DateTime } from 'luxon';

import { ExecutionContext } from '@dolittle/sdk.execution';

import { EventLogSequenceNumber } from '../EventLogSequenceNumber';
import { EventSourceId } from '../EventSourceId';
import { EventType } from '../EventType';

/**
 * Represents a committed event.
 */
export class CommittedEvent {

    /**
     * Initializes a new instance of {@link CommittedEvent}.
     * @param {EventLogSequenceNumber} eventLogSequenceNumber - The sequence number in the event log.
     * @param {DateTime} occurred - Timestamp for when it occurred.
     * @param {EventSourceId} eventSourceId - Identifier of the event source.
     * @param {ExecutionContext} executionContext - The execution context in which the event happened.
     * @param {EventType} type - Type of event.
     * @param {*} content - Actual content of the event.
     * @param {boolean} isPublic - Whether or not the event is a public event.
     * @param {boolean} isExternal - Whether or not the event is originating externally.
     * @param {number} externalEventLogSequenceNumber - If external; the external event log sequence number.
     * @param {DateTime} externalEventReceived - If external; timestamp for when it was received.
     */
    constructor(
        readonly eventLogSequenceNumber: EventLogSequenceNumber,
        readonly occurred: DateTime,
        readonly eventSourceId: EventSourceId,
        readonly executionContext: ExecutionContext,
        readonly type: EventType,
        readonly content: any,
        readonly isPublic: boolean,
        readonly isExternal: boolean,
        readonly externalEventLogSequenceNumber: EventLogSequenceNumber,
        readonly externalEventReceived: DateTime) {
    }
}

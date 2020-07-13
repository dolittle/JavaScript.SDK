// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { DateTime } from 'luxon';
import { Guid } from '@dolittle/rudiments';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { EventSourceId } from './EventSourceId';

/**
 * Represents the context of an event.
 */
export class EventContext {

    /**
     * Initializes a new instance of {EventContext}.
     * @param {number} sequenceNumber Sequence number in the event log the event belongs to.
     * @param {EventSourceId} eventSourceId Unique identifier of the event source it originates from.
     * @param {DateTime} occurred DateTime in UTC for when the event occurred.
     * @param {ExecutionContext} executionContext The execution context the event happened in.
     */
    constructor(
        readonly sequenceNumber: number,
        readonly eventSourceId: EventSourceId,
        readonly occurred: DateTime,
        readonly executionContext: ExecutionContext) {
    }
}

// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { EventLogSequenceNumber } from '../EventLogSequenceNumber';

/**
 * Exception that gets thrown when a sequence of events are not valid for the Aggregate Root it is being used with.
 */
export class EventLogSequenceNumberIsOutOfOrder extends Error {
    /**
     * Initializes a new instance of the {@link AggregateRootVersionIsOutOfOrder} class.
     * @param {EventLogSequenceNumber}sequenceNumber - The attempted sequence number.
     * @param {EventLogSequenceNumber} expectedSequenceNumber - The expected sequence number.
     */
    constructor(sequenceNumber: EventLogSequenceNumber, expectedSequenceNumber: EventLogSequenceNumber) {
        super(`Event Log Sequence is out of order because Event Log Sequence Number  '${sequenceNumber}' is not greater than '${expectedSequenceNumber}'.`);
    }
}

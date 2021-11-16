// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ConceptAs } from '@dolittle/concepts';
import { EventLogSequenceNumberMustBeAPositiveInteger } from './EventLogSequenceNumberMustBeAPositiveInteger';

/**
 * Represents the event log sequence number of a Committed Event.
 */
export class EventLogSequenceNumber extends ConceptAs<number, '@dolittle/sdk.events.EventLogSequenceNumber'>{

    /**
     * Initialises a new instance of the {@link EventLogSequenceNumber} class.
     * @param {number} value - The event log sequence number.
     */
    constructor(value: number) {
        if (!Number.isSafeInteger(value) || value < 0) throw new EventLogSequenceNumberMustBeAPositiveInteger();
        super(value, '@dolittle/sdk.events.EventLogSequenceNumber');
    }

    /**.
     * Represents the first {@link EventLogSequenceNumber}
     */
    static first: EventLogSequenceNumber = EventLogSequenceNumber.from(0);

    /**
     * Creates a {@link EventLogSequenceNumber} from a {@link number}.
     * @param {number | EventLogSequenceNumber} value - The event log sequence number.
     * @returns {EventLogSequenceNumber} The created event log sequence number concept.
     */
    static from(value: number | EventLogSequenceNumber): EventLogSequenceNumber {
        return new EventLogSequenceNumber(value instanceof EventLogSequenceNumber ? value.value : value);
    }
}

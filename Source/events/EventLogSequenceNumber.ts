// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ConceptAs } from '@dolittle/concepts';
import { EventLogSequenceNumberMustBeAPositiveInteger } from './EventLogSequenceNumberMustBeAPositiveInteger';

/**
 * Represents the event log sequence number of a Committed Event.
 *
 * @export
 * @class EventLogSequenceNumber
 * @extends {ConceptAs<number, '@dolittle/sdk.events.EventLogSequenceNumber'>}
 */
export class EventLogSequenceNumber extends ConceptAs<number, '@dolittle/sdk.events.EventLogSequenceNumber'>{

    constructor(value: number) {
        if (!Number.isSafeInteger(value) || value < 0) throw new EventLogSequenceNumberMustBeAPositiveInteger();
        super(value, '@dolittle/sdk.events.EventLogSequenceNumber');
    }

    /**
     * Represents the first {EventLogSequenceNumber}
     *
     * @static
     * @type {Generation}
     */
    static first: EventLogSequenceNumber = EventLogSequenceNumber.from(0);

    /**
     * Creates a {EventLogSequenceNumber} from a number.
     *
     * @static
     * @param {number | EventLogSequenceNumber} value
     * @returns {Generation}
     */
    static from(value: number | EventLogSequenceNumber): EventLogSequenceNumber {
        return new EventLogSequenceNumber(value instanceof EventLogSequenceNumber ? value.value : value);
    }
}

// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';

/**
 * Exception that gets thrown when {@link EventLogSequenceNumber} is not a natural number.
 */
export class EventLogSequenceNumberMustBeAPositiveInteger extends Exception {
    /**
     * Initialises a new instance of the {@link EventLogSequenceNumberMustBeAPositiveInteger} class.
     */
    constructor() {
        super('The event log sequence number must be a positive integer');
    }
}

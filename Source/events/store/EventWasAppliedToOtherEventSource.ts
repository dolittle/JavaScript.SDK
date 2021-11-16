// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { EventSourceId } from '../index';

/**
 * Exception that gets thrown when a an event is applied to an event source other than the one expected.
 */
export class EventWasAppliedToOtherEventSource extends Error {

    /**
     * Initializes a new instance of {@link EventWasAppliedToOtherEventSource}.
     * @param {EventSourceId} eventSource - The applied event source.
     * @param {EventSourceId} expectedEventSource - The expected event source.
     */
    constructor(eventSource: EventSourceId, expectedEventSource: EventSourceId) {
        super(`Event Source '${eventSource}' does not match with expected '${expectedEventSource}'.`);
    }
}

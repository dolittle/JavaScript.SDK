// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

/**
 * Exception that is thrown when there are expected events to come back from the runtime and there are none.
 */
export class MissingEventsFromRuntime extends Error {
    /**
     * Initializes a new instance of {MissingEventsFromRuntime}.
     */
    constructor() {
        super('Events are not present in payload coming back from runtime');
    }
}

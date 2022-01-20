// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

/**
 * Exception that gets thrown when attempting to commit an event without any content.
 */
export class EventContentNeedsToBeDefined extends Error {

    /**
     * Initializes a new instance of {@link EventContentNeedsToBeDefined}.
     */
    constructor() {
        super('Event content can not be null or undefined');
    }
}

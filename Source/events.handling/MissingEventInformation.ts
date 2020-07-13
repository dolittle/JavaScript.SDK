// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

/**
 * Exception that gets thrown if there are details missing on an event
 */
export class MissingEventInformation extends Error {

    /**
     * Initializes a new instance of {@link MissingEventInformation}.
     * @param {string} details What details that are missing.
     */
    constructor(details: string) {
        super(`Missing information on event: ${details}`);
    }
}

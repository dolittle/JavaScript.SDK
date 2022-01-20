// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

/**
 * The exception that gets thrown when a retrying observable is cancelled.
 */
export class RetryCancelled extends Error {
    /**
     * Initialises a new instance of the {@link RetryCancelled} class.
     */
    constructor() {
        super('Retry was cancelled');
    }
}

// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

/**
 * Exception that gets thrown when waiting for procesors to complete is cancelled.
 */
export class WaitingForProcessorsCompletionCancelled extends Error {
    /**
     * Initialises a new instance of the {@link WaitingForProcessorsCompletionCancelled} class.
     */
    constructor() {
        super('Waiting for processors to complete was cancelled');
    }
}

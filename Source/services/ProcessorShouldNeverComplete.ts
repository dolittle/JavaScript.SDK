// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

/**
 * Exception that gets thrown when a processor that should never complete, completes.
 */
export class ProcessorShouldNeverComplete extends Error {
    /**
     * Initialises a new instance of the {@link ProcessorShouldNeverComplete} class.
     */
    constructor() {
        super('A processor that was expected to be registered forever completed.');
    }
}

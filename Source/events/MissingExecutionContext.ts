// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

/**
 * Exception that is thrown when the execution context is missing.
 */
export class MissingExecutionContext extends Error {

    /**
     * Initializes a new instance of {MissingExecutionContext}.
     */
    constructor() {
        super('The execution context is missing. Impossible to continue.');
    }
}

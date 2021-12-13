// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

/**
 * The exception that gets thrown when a decorator function is called on an unexpected target.
 */
export class CannotDetermineDecoratorTarget extends Error {
    /**
     * Initialises a new instance of the {@link CannotDetermineDecoratorTarget} class.
     */
    constructor() {
        super('Cannot determine decorator target.');
    }
}

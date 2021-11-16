// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

/**
 * Exception that is called when build methods that does not allow for multiple calls gets called multiple times.
 */
export class EventBuilderMethodAlreadyCalled extends Error {
    /**
     * Initialises a new instance of the {@link EventBuilderMethodAlreadyCalled} class.
     * @param {string} method - The name of the method that was called multiple times.
     */
    constructor(method: string) {
        super(`The method '${method}' can only be called once while building.`);
    }
}

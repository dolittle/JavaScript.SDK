// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

/**
 * The exception that is called when build methods that does not allow for multiple calls gets called multiple times.
 */
export class EventBuilderMethodAlreadyCalled extends Error {
    /**
     * @param method
     */
    constructor(method: string) {
        super(`The method '${method}' can only be called once while building.`);
    }
}

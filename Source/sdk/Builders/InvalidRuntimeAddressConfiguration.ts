// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

/**
 * Exception that gets thrown when trying to configure the Dolittle Client with an invalid Runtime address.
 */
export class InvalidRuntimeAddressConfiguration extends Error {
    /**
     * Initialises a new instance of the {@link InvalidRuntimeAddressConfiguration} class.
     * @param {string} value - The configured value.
     */
    constructor(value: string) {
        super(`The Runtime address must be on the format of 'host' or 'host:port'. Got ${value}`);
    }
}

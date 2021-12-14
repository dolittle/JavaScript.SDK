// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

/**
 * The exception that gets thrown when the Runtime returns an incomplete handshake response.
 */
export class RuntimeHandshakeMissingInformation extends Error {
    /**
     * Initialises a new instance of the {@link RuntimeHandshakeMissingInformation} class.
     * @param {string} missing - The missing information.
     */
    constructor(missing: string) {
        super(`The handshake response from the Runtime is missing ${missing}`);
    }
}

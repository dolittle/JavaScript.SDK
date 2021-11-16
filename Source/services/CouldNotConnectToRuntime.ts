// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';

/**
 * Exception that gets thrown when the a the connection to the Runtime could not be established.
 */
export class CouldNotConnectToRuntime extends Exception {

    /**
     * Initializes a new instance of {@link CouldNotConnectToRuntime}.
     * @param {string} address - The address of the Runtime that was connected to.
     */
    constructor(address: string) {
        super(`Could not connect to a Runtime on '${address}'. PLease make sure a Runtime is running, and that the private port (usually 50053) is accessible on the specified port.`);
    }
}

// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { TimeoutError } from 'rxjs';

/**
 * Exception that gets thrown when the a Ping is not received from the Server in the specified amount of time.
 */
export class PingTimeout extends TimeoutError {

    /**
     * Initializes a new instance of {@link PingTimeout}.
     */
    constructor() {
        super();
        this.message = 'Waiting for Ping from Server timed out';
    }
}

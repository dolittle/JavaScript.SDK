// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IDolittleClient } from './IDolittleClient';

/**
 * Exception that gets thrown when .Connect() is called multiple times on a {@link IDolittleClient}.
 */
export class CannotConnectDolittleClientMultipleTimes extends Error {
    /**
     * Initialises a new instance of the {@link CannotConnectDolittleClientMultipleTimes} class.
     */
    constructor() {
        super('Connect() can only be called once on a Dolittle Client');
    }
}

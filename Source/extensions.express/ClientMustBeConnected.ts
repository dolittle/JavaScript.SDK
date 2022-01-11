// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';

import { IDolittleClient } from '@dolittle/sdk';

import { Middleware } from './Middleware';

/**
 * The exception that is thrown when setting an {@link IDolittleClient} that is not connected on a {@link Middleware}.
 */
export class ClientMustBeConnected extends Exception {
    /**
     * Initialises a new instance of the {@link ClientMustBeConnected} class.
     */
    constructor() {
        super(`The ${IDolittleClient.name} to be used in a ${Middleware.name} must be connected before it can be used`);
    }
}

// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';

import { inject } from './inject';

/**
 * The exception that gets thrown when the function returned by {@link inject} is not called with a handler function.
 */
export class InjectNotCalledWithHandler extends Exception {
    /**
     * Initialises a new instance of the {@link InjectNotCalledWithHandler} class.
     */
    constructor() {
        super(`The handler generator ${inject.name} was not called with a handler function. Did you forget to define the handler?`);
    }
}

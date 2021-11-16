// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';

/**
 * Exception that gets thrown if callback is not a function.
 */
export class CallbackShouldBeFunction extends Exception {

    /**
     * Initializes a new instance of {@link CallbackShouldBeFunction}
     * @param {*} callback The alleged callback which is not a function.
     */
    constructor(callback: any) {
        super(`Argument '${typeof callback}' is not a function`);
    }

    /**
     * Asserts an alleged callback for being a function. Throws {@link CallbackShouldBeFunction} if it is not a function.
     * @param {*} callback Callback to check.
     */
    static assert(callback: any) {
        if (typeof callback !== 'function') {
            throw new CallbackShouldBeFunction(callback);
        }
    }
}

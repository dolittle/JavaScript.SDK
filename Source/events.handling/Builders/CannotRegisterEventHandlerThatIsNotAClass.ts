// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';

/**
 * Exception that gets thrown when attempting to register an event handler by instance, that is not a class.
 */
export class CannotRegisterEventHandlerThatIsNotAClass extends Exception {
    /**
     * Creates an instance of CannotRegisterEventHandlerThatIsNotAClass.
     * @param {any} instance - The instance of the event handler that is not class.
     */
    constructor(instance: any) {
        super(`Event handler instance ${instance} is not a class`);
    }
}

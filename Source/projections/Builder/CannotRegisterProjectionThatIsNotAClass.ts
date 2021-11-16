// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';

/**
 * Exception that gets thrown when attempting to register a projection by instance, that is not a class.
 *
 * @export
 * @class CannotRegisterProjectionThatIsNotAClass
 * @augments {Exception}
 */
export class CannotRegisterProjectionThatIsNotAClass extends Exception {
    /**
     * Creates an instance of CannotRegisterProjectionThatIsNotAClass.
     * @param {any} instance - The instance of the projection that is not class.
     */
    constructor(instance: any) {
        super(`Projection instance ${instance} is not a class`);
    }
}

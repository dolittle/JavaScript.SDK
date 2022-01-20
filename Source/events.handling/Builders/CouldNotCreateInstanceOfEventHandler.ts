// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

/**.
 * Exception that gets thrown when the {@link IContainer} could not create an instance of the event handler
 *
 * @export
 * @class CouldNotCreateInstanceOfEventHandler
 * @extends {Exception}
 */
export class CouldNotCreateInstanceOfEventHandler extends Exception {
    /**
     * Initializes an instance of {@link CouldNotCreateInstanceOfEventHandler}.
     * @param {Constructor<any>} type - The event handler type to be instantiated.
     * @param {any} error - The error.
     */
    constructor(type: Constructor<any>, error: any) {
        super(`Could not create an instance of the event handler ${type.name}. ${error}`);
    }
}

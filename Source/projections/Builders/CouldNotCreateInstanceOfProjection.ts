// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

/**.
 * Exception that gets thrown when the {@link IContainer} could not create an instance of the projection
 *
 * @export
 * @class CouldNotCreateInstanceOfProjection
 * @extends {Exception}
 */
export class CouldNotCreateInstanceOfProjection extends Exception {
    /**
     * Initializes an instance of {@link CouldNotCreateInstanceOfProjection}.
     * @param {Constructor<any>} type - The projection type to be instantiated.
     * @param {Exception} inner - The inner exception.
     */
    constructor(type: Constructor<any>, inner:  Exception) {
        super(`Could not create an instance of the projection ${type.name}. ${inner}`);
    }
}

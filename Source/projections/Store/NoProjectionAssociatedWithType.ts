// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

/**
 * Exception that gets thrown when trying to get a projection that is not associated to a type.
 */
export class NoProjectionAssociatedWithType extends Exception {
    /**
     * Initialises a new instance of the {@link NoProjectionAssociatedWithType} class.
     * @param {Constructor<any>} type - The type that is not associated with a projection.
     */
    constructor(type: Constructor<any>) {
        super(`No projection associated with type ${type.name}`);
    }
}

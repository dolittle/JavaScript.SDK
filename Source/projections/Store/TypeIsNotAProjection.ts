// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

/**
 * Exception that gets thrown when trying to associate a type that isn't a projection.
 */
export class TypeIsNotAProjection extends Exception {
    /**
     * @param type
     */
    constructor(type: Constructor<any> | any) {
        super(`Type ${type.name} is not a projection. Did you add the @projection() decorator to the type?`);
    }
}

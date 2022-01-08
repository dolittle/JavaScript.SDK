// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

import { TypeMap } from './TypeMap';

/**
 * The exception that gets thrown when getting a key that is not associated with a type from a {@link TypeMap}.
 */
export class TypeNotAssociatedWithKey extends Exception {
    /**
     * Initialises a new instance of the {@link TypeNotAssociatedWithKey} class.
     * @param {Constructor} type - The type that is missing an association.
     * @param {Constructor} keyType - The type of the association key.
     */
    constructor(type: Constructor<any>, keyType: Constructor<any>) {
        super(`'${type.name}' does not have an ${keyType.name} association.`);
    }
}

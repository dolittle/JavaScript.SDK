// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

import { TypeMap } from './TypeMap';

/**
 * The exception that gets thrown when it is not possible to resolve the key for an object from a {@link TypeMap}.
 */
export class UnableToResolveKey extends Exception {
    /**
     * Initialises a new instance of the {@link TypeNotAssociatedWithKey} class.
     * @param {any} object - The type that is missing an association.
     * @param {Constructor} keyType - The type of the association key.
     */
    constructor(object: any, keyType: Constructor<any>) {
        super(`'${object}' does not have an ${keyType.name} association.`);
    }
}

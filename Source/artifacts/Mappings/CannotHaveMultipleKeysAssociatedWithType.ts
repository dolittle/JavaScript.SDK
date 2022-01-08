// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

import { TypeMap } from './TypeMap';

/**
 * The exception that gets thrown when attempting to associate multiple keys with a type in a {@link TypeMap}.
 */
export class CannotHaveMultipleKeysAssociatedWithType extends Exception {
    /**
     * Initialises a new instance of the {@link CannotHaveMultipleKeysAssociatedWithType} class.
     * @param {Constructor} type - The type that was already associated with a key.
     * @param {any} key - The key that was attempted to associate with.
     * @param {any} associatedKey - The key that the type was already associated with.
     * @param {Constructor} keyType - The type of the association key.
     */
    constructor(type: Constructor<any>, key: any, associatedKey: any, keyType: Constructor<any>) {
        super(`'${type.name}' cannot be associated with ${keyType.name} ${key} because it is already associated with ${associatedKey}.`);
    }
}

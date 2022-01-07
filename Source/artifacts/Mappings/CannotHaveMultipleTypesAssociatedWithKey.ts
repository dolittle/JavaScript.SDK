// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

import { TypeMap } from './TypeMap';

/**
 * The exception that gets thrown when attempting to associate multiple types with a key in a {@link TypeMap}.
 */
export class CannotHaveMultipleTypesAssociatedWithKey extends Exception {
    /**
     * Initialises a new instance of the {@link CannotHaveMultipleTypesAssociatedWithKey} class.
     * @param {any} key - The key that was already associated with a type.
     * @param {Constructor} type - The type that was attempted to associate with.
     * @param {Constructor} associatedType - The type that the key was already associated with.
     * @param {Constructor} keyType - The type of the association key.
     */
    constructor(key: any, type: Constructor<any>, associatedType: Constructor<any>, keyType: Constructor<any>) {
        super(`${keyType.name} '${type.name}' cannot be associated with ${type.name} because it is already associated with ${associatedType.name}.`);
    }
}

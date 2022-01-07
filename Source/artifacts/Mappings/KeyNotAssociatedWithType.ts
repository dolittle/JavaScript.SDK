// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';

import { TypeMap } from './TypeMap';

/**
 * The exception that gets thrown when getting a type that is not associated with a key from a {@link TypeMap}.
 */
export class KeyNotAssociatedWithType extends Exception {
    /**
     * Initialises a new instance of the {@link KeyNotAssociatedWithType} class.
     * @param {any} key - The key that is missing an association.
     */
    constructor(key: any) {
        super(`'${key}' does not have an type association.`);
    }
}

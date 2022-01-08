// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';
import { NestedMap } from './NestedMap';

/**
 * The exception that gets thrown when using a {@link NestedMap} with an incorrect number of primitive keys.
 */
export class IncorrectNumberOfPrimitiveKeysProvided extends Exception {
    /**
     * Initialises a new instance of the {@link IncorrectNumberOfPrimitiveKeysProvided} class.
     * @param {number} numberOfKeys - The number of primitive keys provided.
     * @param {number} depth - The depth of the {@link NestedMap}.
     */
    constructor(numberOfKeys: number, depth: number) {
        super(`Incorrect number of primitive keys provided to ${NestedMap.name}. Got ${numberOfKeys}, expected ${depth}`);
    }
}

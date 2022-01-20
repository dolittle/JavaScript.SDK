// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';
import { NestedMap } from './NestedMap';

/**
 * The exception that gets thrown when attempting to access the internal map of a {@link NestedMap} as a values map when it is not the final level.
 */
export class CannotAccessValuesOfNestedMapWithMoreLevels extends Exception {
    /**
     * Initialises a new instance of the {@link CannotAccessValuesOfNestedMapWithMoreLevels} class.
     * @param {number} depth - The depth at which the internal map was accessed as values.
     */
    constructor(depth: number) {
        super(`The internal map of ${NestedMap.name} cannot be accessed as values when depth is ${depth}, only when depth is 1`);
    }
}

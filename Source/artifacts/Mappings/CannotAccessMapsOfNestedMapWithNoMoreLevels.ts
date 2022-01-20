// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';
import { NestedMap } from './NestedMap';

/**
 * The exception that gets thrown when attempting to access the internal map of a {@link NestedMap} as a nested map when it is the final level.
 */
export class CannotAccessMapsOfNestedMapWithNoMoreLevels extends Exception {
    /**
     * Initialises a new instance of the {@link CannotAccessMapsOfNestedMapWithNoMoreLevels} class.
     */
    constructor() {
        super(`The internal map of ${NestedMap.name} cannot be accessed as nested map when depth is 1`);
    }
}

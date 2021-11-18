// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';

import { KeySelector } from './KeySelector';

/**
 * Exception that is thrown when trying to register a projection with an unkown key selector type.
 */
export class UnknownKeySelectorType extends Exception {
    /**
     * Initialises a new instance of the {@link UnknownKeySelectorType} class.
     * @param {KeySelector} selectorType - The key selector type that is not implemented.
     */
    constructor(selectorType: KeySelector) {
        super(`The key selector type '${Object.getPrototypeOf(selectorType).constructor.name}' is not implemented`);
    }
}

// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';

import { KeySelector } from './KeySelector';

/**
 * Exception that is thrown when trying to register a projection with an unkown key selector type.
 */
export class UnknownKeySelectorType extends Exception {
    /**
     * @param selectorType
     */
    constructor(selectorType: KeySelector) {
        super(`The key selector type '${Object.getPrototypeOf(selectorType).constructor.name}' is not implemented`);
    }
}

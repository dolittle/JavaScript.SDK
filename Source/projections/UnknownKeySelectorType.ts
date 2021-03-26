// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';
import { KeySelectorType } from './KeySelectorType';

/**
 * Exception that is thrown when trying to register a projection with an unkown key selector type.
 */
export class UnknownKeySelectorType extends Exception {
    constructor(selectorType: KeySelectorType) {
        super(`The key selector type '${selectorType}' is not implemented`);
    }
}

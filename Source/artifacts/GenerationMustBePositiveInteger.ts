// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';

/**
 * Exception that gets thrown when {Generation} is not a natural number.
 *
 * @export
 * @class GenerationMustBePositiveInteger
 * @extends {Exception}
 */
export class GenerationMustBePositiveInteger extends Exception {
    constructor() {
        super('The generation of an artifact must be a positive integer');
    }
}

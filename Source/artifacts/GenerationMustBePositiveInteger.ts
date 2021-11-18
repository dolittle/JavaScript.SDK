// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';

/**
 * Exception that gets thrown when {@link Generation} is not a natural number.
 */
export class GenerationMustBePositiveInteger extends Exception {
    /**
     * Initialises a new instance of the {@link GenerationMustBePositiveInteger} class.
     */
    constructor() {
        super('The generation of an artifact must be a positive integer');
    }
}

// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
import { Exception } from '@dolittle/rudiments';

export class GenerationCannotBeLessThanZero extends Exception {
    constructor() {
        super('The generation of an artifact must be a non-negative number');
    }
}

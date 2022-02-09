// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';

import { Conversion } from './Conversion';

/**
 * The exception that gets thrown when an unknown {@link Conversion} is specified.
 */
export class UnknownMongoDBConversion extends Exception {
    /**
     * Initialises a new instance of the {@link UnknownMongoDBConversion} class.
     * @param {Conversion} conversion - The conversion that was specified.
     */
    constructor(conversion: Conversion) {
        super(`The MongoDB field conversion type ${conversion} is unknown`);
    }
}

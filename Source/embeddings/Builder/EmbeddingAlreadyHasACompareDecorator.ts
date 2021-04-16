// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

/**
 * Exception that gets thrown when attempting to register a a second compare() decorator on an embedding.
 */
export class EmbeddingAlreadyHasACompareDecorator extends Exception {
    /**
     * Creates an instance of EmbeddingAlreadyHasACompareMethod
     * @param {any} instance The embedding class that already has a compare method.
     */
    constructor(target: Constructor<any>) {
        super(`Embedding of type ${target.constructor.name} already has a @compare decorator defined for a method.`);
    }
}

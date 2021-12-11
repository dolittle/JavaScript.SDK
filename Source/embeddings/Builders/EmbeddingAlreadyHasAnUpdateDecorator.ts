// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

/**
 * Exception that gets thrown when attempting to register more than one @resolveUpdateToEvents decorator on an embedding.
 */
export class EmbeddingAlreadyHasAnUpdateDecorator extends Exception {
    /**
     * Creates an instance of EmbeddingAlreadyHasAnUpdateDecorator.
     * @param {Constructor<any>} target - The embedding class that already has a resolveUpdateToEvents method.
     */
    constructor(target: Constructor<any>) {
        super(`Embedding of type ${target.constructor.name} already has a @resolveUpdateToEvents decorator defined for a method.`);
    }
}

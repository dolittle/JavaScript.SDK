// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

/**
 * Exception that gets thrown when attempting to register more than one resolveUpdateToEvents decorator on an embedding.
 */
export class EmbeddingAlreadyHasAnUpdateDecorator extends Exception {
    /**
     * Creates an instance of EmbeddingAlreadyHasAnUpdateDecorator.
     * @param {Constructor<any>} target - The embedding class that already has a resolveUpdateToEvents method.
     * @param {string} methodName - The name of the method where the resolveUpdateToEvents is already used.
     */
    constructor(target: Constructor<any>, methodName: string) {
        super(`Embedding of type ${target.constructor.name} already has a @resolveUpdateToEvents decorator applied to ${methodName}.`);
    }
}

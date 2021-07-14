// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

/**
 * Exception that gets thrown when attempting to register more than one @resolveDeletionToEvents() decorators on an embedding.
 */
export class EmbeddingAlreadyHasARemoveDecorator extends Exception {
    /**
     * Creates an instance of EmbeddingAlreadyHasARemoveDecorator
     * @param {Constructor<any>} instance The embedding class that already has a remove method.
     */
    constructor(target: Constructor<any>) {
        super(`Embedding of type ${target.constructor.name} already has a @remove decorator defined for a method.`);
    }
}

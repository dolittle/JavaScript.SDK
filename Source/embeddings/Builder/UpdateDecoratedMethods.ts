// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';

import { UpdateDecoratedMethod } from './UpdateDecoratedMethod';
import { EmbeddingAlreadyHasAnUpdateDecorator } from './EmbeddingAlreadyHasAnUpdateDecorator';
import { EmbeddingClassUpdateMethod } from './EmbeddingClassUpdateMethod';

/**
 * Represents the system that knows about all the methods decorated with the @resolveUpdateToEvents decorator.
 */
export class UpdateDecoratedMethods {
    /**
     * All on methods grouped by their embedding.
     */
    static readonly methodPerEmbedding: Map<Constructor<any>, UpdateDecoratedMethod> = new Map();

    /**
     * Registers the @resolveUpdateToEvents decorated method
     * @param {Constructor<any>} target Target that owns the on method.
     * @param {EmbeddingClassUpdateMethod} method The update method.
     * @param {string} name The name of the method.
     */
    static register(
        target: Constructor<any>,
        method: EmbeddingClassUpdateMethod,
        name: string): void {
        if (this.methodPerEmbedding.get(target)) {
            throw new EmbeddingAlreadyHasAnUpdateDecorator(target);
        }
        this.methodPerEmbedding.set(target, new UpdateDecoratedMethod(target, method, name));
    }
}

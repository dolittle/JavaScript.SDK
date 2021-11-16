// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';
import { EmbeddingAlreadyHasADeletionDecorator } from './EmbeddingAlreadyHasADeletionDecorator';
import { EmbeddingClassDeletionMethod } from './EmbeddingClassDeletionMethod';
import { DeletionDecoratedMethod } from './DeletionDecoratedMethod';

/**
 * Represents the system that knows about all the methods decorated with the @resolveDeletionToEvents() decorator.
 */
export class DeletionDecoratedMethods {
    /**
     * All on methods grouped by their embedding.
     */
    static readonly methodPerEmbedding: Map<Constructor<any>, DeletionDecoratedMethod> = new Map();

    /**
     * Registers the @resolveDeletionToEvents() decorated method
     * @param {Constructor<any>} target Target that owns the deletion method.
     * @param {EmbeddingClassDeletionMethod} method The deletion method.
     * @param {string} name The name of the method.
     */
    static register(
        target: Constructor<any>,
        method: EmbeddingClassDeletionMethod,
        name: string): void {
        if (this.methodPerEmbedding.get(target)) {
            throw new EmbeddingAlreadyHasADeletionDecorator(target);
        }
        this.methodPerEmbedding.set(target, new DeletionDecoratedMethod(target, method, name));
    }
}

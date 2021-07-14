// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';
import { EmbeddingAlreadyHasARemoveDecorator } from './EmbeddingAlreadyHasARemoveDecorator';
import { EmbeddingClassRemoveMethod } from './EmbeddingClassRemoveMethod';
import { RemoveDecoratedMethod } from './RemoveDecoratedMethod';


/**
 * Represents the system that knows about all the methods decorated with the @resolveDeletionToEvents() decorator.
 */
export class RemoveDecoratedMethods {
    /**
     * All on methods grouped by their embedding.
     */
    static readonly methodPerEmbedding: Map<Constructor<any>, RemoveDecoratedMethod> = new Map();

    /**
     * Registers the @resolveDeletionToEvents() decorated method
     * @param {Constructor<any>} target Target that owns the remove method.
     * @param {EmbeddingClassRemoveMethod} method The remove method.
     * @param {string} name The name of the method.
     */
    static register(
        target: Constructor<any>,
        method: EmbeddingClassRemoveMethod,
        name: string): void {
        if (this.methodPerEmbedding.get(target)) {
            throw new EmbeddingAlreadyHasARemoveDecorator(target);
        }
        this.methodPerEmbedding.set(target, new RemoveDecoratedMethod(target, method, name));
    }
}

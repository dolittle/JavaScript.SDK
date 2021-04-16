// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';

import { DeleteDecoratedMethod } from './DeleteDecoratedMethod';
import { EmbeddingAlreadyHasADeleteDecorator } from './EmbeddingAlreadyHasADeleteDecorator';
import { EmbeddingClassDeleteMethod } from './EmbeddingClassDeleteMethod';

/**
 * Defines the system that knows about all the methods decorated with the delete decorator.
 */
export class DeleteDecoratedMethods {
    /**
     * All on methods grouped by their embedding.
     */
    static readonly methodPerEmbedding: Map<Constructor<any>, DeleteDecoratedMethod> = new Map();

    /**
     * Registers the delete decorated method
     * @param {Constructor<any>} target Target that owns the delete method.
     * @param {EmbeddingDeleteCallback} method The delete method.
     * @param {string} name The name of the method.
     */
    static register(
        target: Constructor<any>,
        method: EmbeddingClassDeleteMethod,
        name: string): void {
        if (this.methodPerEmbedding.get(target)) {
            throw new EmbeddingAlreadyHasADeleteDecorator(target);
        }
        this.methodPerEmbedding.set(target, new DeleteDecoratedMethod(target, method, name));
    }
}

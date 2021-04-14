// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';

import { CompareDecoratedMethod } from './CompareDecoratedMethod';
import { EmbeddingAlreadyHasACompareDecorator } from './EmbeddingAlreadyHasACompareDecorator';
import { EmbeddingCompareCallback } from '../EmbeddingCompareCallback';

/**
 * Defines the system that knows about all the methods decorated with the compare decorator.
 */
export class CompareDecoratedMethods {
    /**
     * All on methods grouped by their embedding.
     */
    static readonly methodPerEmbedding: Map<Constructor<any>, CompareDecoratedMethod> = new Map();

    /**
     * Registers the compare decorated method
     * @param {Constructor<any>} target Target that owns the on method.
     * @param {EmbeddingCompareCallback} method The compare method.
     * @param {string} name The name of the method.
     */
    static register(
        target: Constructor<any>,
        method: EmbeddingCompareCallback,
        name: string): void {
        if (this.methodPerEmbedding.get(target)) {
            throw new EmbeddingAlreadyHasACompareDecorator(target);
        }
        this.methodPerEmbedding.set(target, new CompareDecoratedMethod(target, method, name));
    }
}

// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';

import { EmbeddingCompareCallback } from '..';

/**
 * Represents methods decorated with the on decorator.
 */
export class CompareDecoratedMethod {

    /**
     * Initializes a new instance of {@link OnDecoratedMethod}.
     * @param {Constructor<any>} owner Owner of the method.
     * @param {EmbeddingCompareCallback} method The actual method that does the comparison.
     * @param {string} name The name of the method.
     */
    constructor(
        readonly owner: Constructor<any>,
        readonly method: EmbeddingCompareCallback,
        readonly name: string) {
    }
}

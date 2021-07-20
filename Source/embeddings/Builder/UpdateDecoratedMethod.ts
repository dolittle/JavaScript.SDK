// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';
import { EmbeddingClassUpdateMethod } from './EmbeddingClassUpdateMethod';

/**
 * Represents methods decorated with the compare decorator.
 */
export class UpdateDecoratedMethod {

    /**
     * Initializes a new instance of {@link UpdateDecoratedMethod}.
     * @param {Constructor<any>} owner Owner of the method.
     * @param {EmbeddingClassUpdateMethod} method The actual method that does the comparison.
     * @param {string} name The name of the method.
     */
    constructor(
        readonly owner: Constructor<any>,
        readonly method: EmbeddingClassUpdateMethod,
        readonly name: string) {
    }
}

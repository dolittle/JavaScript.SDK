// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';
import { EmbeddingClassDeleteMethod } from './EmbeddingClassDeleteMethod';

/**
 * Represents methods decorated with the delete decorator.
 */
export class DeleteDecoratedMethod {

    /**
     * Initializes a new instance of {@link DeleteDecoratedMethod}.
     * @param {Constructor<any>} owner Owner of the method.
     * @param {EmbeddingClassDeleteMethod} method The actual method that gets the embedding closer to being deleted.
     * @param {string} name The name of the method.
     */
    constructor(
        readonly owner: Constructor<any>,
        readonly method: EmbeddingClassDeleteMethod,
        readonly name: string) {
    }
}

// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';
import { EmbeddingClassRemoveMethod } from './EmbeddingClassRemoveMethod';

/**
 * Represents methods decorated with the @remove() decorator.
 */
export class RemoveDecoratedMethod {

    /**
     * Initializes a new instance of {@link RemoveDecoratedMethod}.
     * @param {Constructor<any>} owner Owner of the method.
     * @param {EmbeddingClassRemoveMethod} method The actual method that gets the embedding closer to being deleted.
     * @param {string} name The name of the method.
     */
    constructor(
        readonly owner: Constructor<any>,
        readonly method: EmbeddingClassRemoveMethod,
        readonly name: string) {
    }
}

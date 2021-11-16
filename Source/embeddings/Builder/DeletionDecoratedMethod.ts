// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';
import { EmbeddingClassDeletionMethod } from './EmbeddingClassDeletionMethod';

/**
 * Represents methods decorated with the @resolveDeletionToEvents() decorator.
 */
export class DeletionDecoratedMethod {

    /**
     * Initializes a new instance of {@link DeletionDecoratedMethod}.
     * @param {Constructor<any>} owner - Owner of the method.
     * @param {EmbeddingClassDeletionMethod} method - The actual method that gets the embedding closer to being deleted.
     * @param {string} name - The name of the method.
     */
    constructor(
        readonly owner: Constructor<any>,
        readonly method: EmbeddingClassDeletionMethod,
        readonly name: string) {
    }
}

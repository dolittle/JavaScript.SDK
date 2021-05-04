// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { EmbeddingDecoratedType } from './EmbeddingDecoratedType';

/**
 * Represents a system that handles the registering and mappings between @embedding decorated classes and their given id and options.
 */
export class EmbeddingDecoratedTypes {
    static readonly types: EmbeddingDecoratedType[] = [];

    /**
     * Registers a decorated embedding class with the Runtime.
     * @param {EmbeddingDecoratedType} embeddingDecoratedType The decorated type to register.
     */
    static register(embeddingDecoratedType: EmbeddingDecoratedType) {
        this.types.push(embeddingDecoratedType);
    }
}

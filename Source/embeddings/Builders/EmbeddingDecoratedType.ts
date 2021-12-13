// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';

import { EmbeddingId } from '../EmbeddingId';

/**
 * Represents an embedding created from the decorator.
 */
export class EmbeddingDecoratedType {
    /**
     * Initialises a new instance of {@link EmbeddingDecoratedType}.
     * @param {EmbeddingId} embeddingId - The embedding id.
     * @param {Constructor<any>} type - The embedding type.
     */
    constructor(
        readonly embeddingId: EmbeddingId,
        readonly type: Constructor<any>) {
    }
}

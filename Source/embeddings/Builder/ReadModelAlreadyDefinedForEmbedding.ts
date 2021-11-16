// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';
import { EmbeddingId } from '..';

/**
 * Exception that is thrown when you try to register a readmodel for a embedding when its already defined.
 */
export class ReadModelAlreadyDefinedForEmbedding extends Exception {
    /**
     * Initialises a new instance of {@link ReadModelAlreadyDefinedForEmbedding}.
     * @param {EmbeddingId} embeddingId - The unique identifier of the embedding.
     * @param {Constructor<any> | any} newReadModel - The new read model.
     * @param {Constructor<any> | any} oldReadModel - The old read model.
     */
    constructor(embeddingId: EmbeddingId, newReadModel: Constructor<any> | any, oldReadModel: Constructor<any> | any) {
        super(`Cannot assign readmodel ${newReadModel} to embedding ${embeddingId}. It is already associated with readmodel ${oldReadModel}`);
    }
}

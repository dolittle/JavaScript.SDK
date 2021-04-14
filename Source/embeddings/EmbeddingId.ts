// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ConceptAs } from '@dolittle/concepts';
import { Guid } from '@dolittle/rudiments';

/**
 * Represents the unique identifier of a Embedding.
 */
export class EmbeddingId extends ConceptAs<Guid, '@dolittle/sdk.embeddings.EmbeddingId'> {
    constructor(id: Guid) {
        super(id, '@dolittle/sdk.embeddings.EmbeddingId');
    }

    /**
     * Creates a {EmbeddingId} from a guid.
     *
     * @static
     * @param {string | Guid | EmbeddingId} id
     * @returns {EmbeddingId}
     */
    static from(id: string | Guid | EmbeddingId): EmbeddingId {
        if (id instanceof EmbeddingId) return id;
        return new EmbeddingId(Guid.as(id));
    }
}

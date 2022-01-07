// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { createIsModelIdentifier, ModelIdentifier } from '@dolittle/sdk.common';

import { EmbeddingId, isEmbeddingId } from './EmbeddingId';

/**
 * Represents the identifier of an embedding in an application model.
 */
export class EmbeddingModelId extends ModelIdentifier<EmbeddingId, '@dolittle/sdk.embeddings.EmbeddingId'> {
    /**
     * Initialises a new instance of the {@link EmbeddingModelId} class.
     * @param {EmbeddingId} id - The embedding id.
     */
    constructor(id: EmbeddingId) {
        super(id, '@dolittle/sdk.embeddings.EmbeddingId');
    }
}

/**
 * Checks whether or not an object is an instance of {@link EmbeddingModelId}.
 * @param {any} object - The object to check.
 * @returns {boolean} True if the object is an {@link EmbeddingModelId}, false if not.
 */
export const isEmbeddingModelId = createIsModelIdentifier(
    EmbeddingModelId,
    isEmbeddingId,
    '@dolittle/sdk.embeddings.EmbeddingId');

// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { ScopeId } from '@dolittle/sdk.events';
import { ProjectionDecoratedType, ProjectionDecoratedTypes, ProjectionId } from '@dolittle/sdk.projections';

import { EmbeddingId } from '../EmbeddingId';
import { EmbeddingDecoratedType } from './EmbeddingDecoratedType';
import { EmbeddingDecoratedTypes } from './EmbeddingDecoratedTypes';

/**
 * Decorator to mark a class as an Embedding.
 * @param {EmbeddingId | Guid | string} id - The id to associate with this Embedding.
 * @returns {(any) => void} The decorator to apply.
 */
export function embedding(id: EmbeddingId | Guid | string) {
    return function (target: any) {
        const embeddingId = EmbeddingId.from(id);
        EmbeddingDecoratedTypes.register(new EmbeddingDecoratedType(
            embeddingId,
            target));
        ProjectionDecoratedTypes.register(new ProjectionDecoratedType(
            ProjectionId.from(embeddingId.value),
            ScopeId.default,
            target));
    };
}

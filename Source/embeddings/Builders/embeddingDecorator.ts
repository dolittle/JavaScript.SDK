// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

import { Decorators } from '@dolittle/sdk.common';
import { ScopeId } from '@dolittle/sdk.events';
import { projection } from '@dolittle/sdk.projections';

import { EmbeddingId } from '../EmbeddingId';
import { EmbeddingDecoratedType } from './EmbeddingDecoratedType';

const [decorator, getMetadata] = Decorators.createMetadataDecorator<EmbeddingDecoratedType>('embedding', 'embedding', Decorators.DecoratorTarget.Class);

/**
 * Decorator to mark a class as an Embedding.
 * @param {EmbeddingId | Guid | string} id - The id to associate with this Embedding.
 * @returns {Decorators.Decorator} The decorator.
 */
export function embedding(id: EmbeddingId | Guid | string): Decorators.Decorator {
    const embeddingId = EmbeddingId.from(id);
    const projectionDecorator = projection(embeddingId.value, { inScope: ScopeId.default });
    return decorator((target, type) => {
        projectionDecorator(type);
        return new EmbeddingDecoratedType(embeddingId, type);
    });
}

/**
 * Gets the {@link EmbeddingDecoratedType} of the specified class.
 * @param {Constructor<any>} type - The class to get the decorated embedding type for.
 * @returns {EmbeddingDecoratedType | undefined} The decorated embedding type if decorated.
 */
export function getEmbeddingDecoratedType(type: Constructor<any>): EmbeddingDecoratedType | undefined {
    return getMetadata(type);
}

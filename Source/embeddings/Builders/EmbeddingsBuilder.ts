// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

import { IClientBuildResults, IModelBuilder } from '@dolittle/sdk.common';

import { EmbeddingId } from '../EmbeddingId';
import { EmbeddingModelId } from '../EmbeddingModelId';
import { EmbeddingBuilder } from './EmbeddingBuilder';
import { EmbeddingClassBuilder } from './EmbeddingClassBuilder';
import { embedding as embeddingDecorator, getDecoratedEmbeddingType, isDecoratedEmbeddingType } from './embeddingDecorator';
import { IEmbeddingBuilder } from './IEmbeddingBuilder';
import { IEmbeddingsBuilder } from './IEmbeddingsBuilder';

/**
 * Represents an implementation of {@link IEmbeddingsBuilder}.
 */
export class EmbeddingsBuilder extends IEmbeddingsBuilder {
    /**
     * Initialises a new instance of the {@link EmbeddingsBuilder} class.
     * @param {IModelBuilder} _modelBuilder - For binding projections to identifiers.
     * @param {IClientBuildResults} _buildResults - For keeping track of build results.
     */
    constructor(
        private readonly _modelBuilder: IModelBuilder,
        private readonly _buildResults: IClientBuildResults
    ) {
        super();
    }

    /** @inheritdoc */
    createEmbedding(embeddingId: string | EmbeddingId | Guid): IEmbeddingBuilder {
        const id = EmbeddingId.from(embeddingId);
        const builder = new EmbeddingBuilder(id, this._modelBuilder);
        const identifier = new EmbeddingModelId(id);
        this._modelBuilder.bindIdentifierToProcessorBuilder(identifier, builder);
        return builder;
    }

    /** @inheritdoc */
    registerEmbedding<T>(type: Constructor<T>): IEmbeddingsBuilder {
        if (!isDecoratedEmbeddingType(type)) {
            this._buildResults.addFailure(`The embeddings class ${type.name} is not decorated as an embeddings`,`Add the @${embeddingDecorator.name} decorator to the class`);
            return this;
        }

        const embeddingType = getDecoratedEmbeddingType(type);
        const identifier = new EmbeddingModelId(embeddingType.embeddingId);
        const builder = new EmbeddingClassBuilder<T>(embeddingType);
        this._modelBuilder.bindIdentifierToType(identifier, type);
        this._modelBuilder.bindIdentifierToProcessorBuilder(identifier, builder);
        return this;
    }
}

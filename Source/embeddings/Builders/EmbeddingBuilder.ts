// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IEquatable } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

import { IClientBuildResults, IModelBuilder } from '@dolittle/sdk.common';
import { IEventTypes } from '@dolittle/sdk.events';

import { IEmbedding } from '../Internal/IEmbedding';
import { EmbeddingId } from '../EmbeddingId';
import { EmbeddingModelId } from '../EmbeddingModelId';
import { EmbeddingBuilderForReadModel } from './EmbeddingBuilderForReadModel';
import { IEmbeddingBuilder } from './IEmbeddingBuilder';
import { ReadModelAlreadyDefinedForEmbedding } from './ReadModelAlreadyDefinedForEmbedding';

/**
 * Represents an implementation of {@link IEmbeddingBuilder}.
 */
export class EmbeddingBuilder extends IEmbeddingBuilder implements IEquatable {
    private _readModelTypeOrInstance?: Constructor<any> | any;
    private _builder?: EmbeddingBuilderForReadModel<any>;

    /**
     * Initializes a new instance of {@link EmbeddingBuilder}.
     * @param {EmbeddingId} _embeddingId - The unique identifier of the embedding to build for.
     * @param {IModelBuilder} _modelBuilder - For binding read models to identifiers.
     */
    constructor(
        private readonly _embeddingId: EmbeddingId,
        private readonly _modelBuilder: IModelBuilder,
    ) {
        super();
    }

    /** @inheritdoc */
    forReadModel<T>(typeOrInstance: Constructor<T> | T): EmbeddingBuilderForReadModel<T> {
        if (this._readModelTypeOrInstance) {
            throw new ReadModelAlreadyDefinedForEmbedding(this._embeddingId, typeOrInstance, this._readModelTypeOrInstance);
        }
        this._readModelTypeOrInstance = typeOrInstance;

        if (typeOrInstance instanceof Function) {
            this._modelBuilder.bindIdentifierToType(new EmbeddingModelId(this._embeddingId), typeOrInstance);
        }

        this._builder = new EmbeddingBuilderForReadModel(this._embeddingId, typeOrInstance);
        return this._builder;
    }

    /** @inheritdoc */
    equals(other: any): boolean {
        return this === other;
    }

    /**
     * Builds the embedding.
     * @param {IEventTypes} eventTypes - For event types resolution.
     * @param {IClientBuildResults} results - For keeping track of build results.
     * @returns {IEmbedding | undefined} The built embedding if successful.
     */
    build(eventTypes: IEventTypes, results: IClientBuildResults): IEmbedding<any> | undefined {
        if (!this._builder) {
            results.addFailure(`Failed to register embedding ${this._embeddingId}. No read model defined for embedding.`);
            return;
        }
        return this._builder.build(eventTypes, results);
    }
}

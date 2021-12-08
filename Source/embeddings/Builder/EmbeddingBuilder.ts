// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';

import { IClientBuildResults } from '@dolittle/sdk.common/ClientSetup';
import { IEventTypes } from '@dolittle/sdk.events';
import { IProjectionAssociations, ProjectionId } from '@dolittle/sdk.projections';

import { EmbeddingId } from '..';
import { IEmbedding } from '../Internal';
import { EmbeddingBuilderForReadModel } from './EmbeddingBuilderForReadModel';
import { IEmbeddingBuilder } from './IEmbeddingBuilder';
import { ReadModelAlreadyDefinedForEmbedding } from './ReadModelAlreadyDefinedForEmbedding';

/**
 * Represents an implementation of {@link IEmbeddingBuilder}.
 */
export class EmbeddingBuilder extends IEmbeddingBuilder {
    private _readModelTypeOrInstance?: Constructor<any> | any;
    private _builder?: EmbeddingBuilderForReadModel<any>;

    /**
     * Initializes a new instance of {@link EmbeddingBuilder}.
     * @param {EmbeddingId} _embeddingId - The unique identifier of the embedding to build for.
     * @param {IProjectionAssociations} _projectionAssociations - The projection associations.
     */
    constructor(
        private readonly _embeddingId: EmbeddingId,
        private readonly _projectionAssociations: IProjectionAssociations
    ) {
        super();
    }

    /** @inheritdoc */
    forReadModel<T>(typeOrInstance: Constructor<T> | T): EmbeddingBuilderForReadModel<T> {
        if (this._readModelTypeOrInstance) {
            throw new ReadModelAlreadyDefinedForEmbedding(this._embeddingId, typeOrInstance, this._readModelTypeOrInstance);
        }
        this._readModelTypeOrInstance = typeOrInstance;
        this._builder = new EmbeddingBuilderForReadModel(this._embeddingId, typeOrInstance);

        this._projectionAssociations.associate<T>(this._readModelTypeOrInstance, ProjectionId.from(this._embeddingId.value));

        return this._builder;
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

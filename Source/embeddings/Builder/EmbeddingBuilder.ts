// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { EmbeddingsClient } from '@dolittle/runtime.contracts/Embeddings/Embeddings_grpc_pb';
import { IContainer } from '@dolittle/sdk.common';
import { IEventTypes } from '@dolittle/sdk.events';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { IProjectionAssociations, ProjectionId } from '@dolittle/sdk.projections';
import { Cancellation } from '@dolittle/sdk.resilience';
import { Constructor } from '@dolittle/types';
import { Logger } from 'winston';
import { EmbeddingId, IEmbeddings } from '..';
import { EmbeddingBuilderForReadModel } from './EmbeddingBuilderForReadModel';
import { ICanBuildAndRegisterAnEmbedding } from './ICanBuildAndRegisterAnEmbedding';
import { ReadModelAlreadyDefinedForEmbedding } from './ReadModelAlreadyDefinedForEmbedding';





/**
 * Represents a builder for building embeddings inline.
 */
export class EmbeddingBuilder implements ICanBuildAndRegisterAnEmbedding {
    private _readModelTypeOrInstance?: Constructor<any> | any;
    private _builder?: EmbeddingBuilderForReadModel<any>;

    /**
     * Initializes a new instance of {@link EmbeddingBuilder}.
     * @param {EmbeddingId} _embeddingId  The unique identifier of the embedding to build for
     * @param {IProjectionAssociations} _projectionAssociations The projection associations
     */
    constructor(private readonly _embeddingId: EmbeddingId, private readonly _projectionAssociations: IProjectionAssociations) { }

    /**
     * Defines the type of the read model the embedding builds. The initial state of a newly
     * created read model is given by the provided instance or an instance constructed by
     * the default constructor of the provided type.
     * @param {Constructor<T> | T} typeOrInstance The type or an instance of the read model.
     * @returns {EmbeddingBuilderForReadModel<T>}
     */
    forReadModel<T>(typeOrInstance: Constructor<T> | T): EmbeddingBuilderForReadModel<T> {
        if (this._readModelTypeOrInstance) {
            throw new ReadModelAlreadyDefinedForEmbedding(this._embeddingId, typeOrInstance, this._readModelTypeOrInstance);
        }
        this._readModelTypeOrInstance = typeOrInstance;
        this._builder = new EmbeddingBuilderForReadModel(this._embeddingId, typeOrInstance);

        this._projectionAssociations.associate<T>(this._readModelTypeOrInstance, ProjectionId.from(this._embeddingId.value));

        return this._builder;
    }

    /** @inheritdoc */
    buildAndRegister(
        client: EmbeddingsClient,
        embeddings: IEmbeddings,
        container: IContainer,
        executionContext: ExecutionContext,
        eventTypes: IEventTypes,
        logger: Logger,
        cancellation: Cancellation): void {
        if (!this._builder) {
            logger.warn(`Failed to register embedding ${this._embeddingId}. No read model defined for embedding.`);
            return;
        }
        this._builder.buildAndRegister(
            client,
            embeddings,
            container,
            executionContext,
            eventTypes,
            logger,
            cancellation);
    }
}

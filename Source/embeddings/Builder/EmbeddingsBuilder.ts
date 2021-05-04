// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';

import { Guid } from '@dolittle/rudiments';
import { IEventTypes } from '@dolittle/sdk.events';
import { IContainer } from '@dolittle/sdk.common';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { Constructor } from '@dolittle/types';
import { Cancellation } from '@dolittle/sdk.resilience';
import { IProjectionAssociations } from '@dolittle/sdk.projections';

import { EmbeddingsClient } from '@dolittle/runtime.contracts/Embeddings/Embeddings_grpc_pb';

import { IEmbeddings, EmbeddingId, Embeddings } from '..';

import { ICanBuildAndRegisterAnEmbedding } from './ICanBuildAndRegisterAnEmbedding';
import { EmbeddingBuilder } from './EmbeddingBuilder';
import { EmbeddingClassBuilder } from './EmbeddingClassBuilder';

/**
 * Represents a builder for building multiple embeddings.
 */
export class EmbeddingsBuilder {
    private _embeddingBuilders: ICanBuildAndRegisterAnEmbedding[] = [];

    constructor(private _projectionAssociations: IProjectionAssociations) {}

    /**
     * Start building an embedding.
     * @param {EmbeddingId | Guid | string} embeddingId  The unique identifier of the embedding.
     * @returns {EmbeddingBuilder}
     */
    createEmbedding(embeddingId: EmbeddingId | Guid | string): EmbeddingBuilder {
        const builder = new EmbeddingBuilder(EmbeddingId.from(embeddingId), this._projectionAssociations);
        this._embeddingBuilders.push(builder);
        return builder;
    }

    /**
     * Register a type as an embedding
     * @param type The type to register as a embedding.
     */
    register<T = any>(type: Constructor<T>): EmbeddingsBuilder;
    /**
     * Register an instance as an embedding.
     * @param instance The instance to register as an event handler.
     */
    register<T = any>(instance: T): EmbeddingsBuilder;
    register<T = any>(typeOrInstance: Constructor<T> | T): EmbeddingsBuilder {
        this._embeddingBuilders.push(new EmbeddingClassBuilder<T>(typeOrInstance));
        this._projectionAssociations.associate<T>(typeOrInstance);
        return this;
    }

    buildAndRegister(
        client: EmbeddingsClient,
        container: IContainer,
        executionContext: ExecutionContext,
        eventTypes: IEventTypes,
        logger: Logger,
        cancellation: Cancellation): IEmbeddings {
        const embeddings = new Embeddings(logger);

        for (const embeddingBuilder of this._embeddingBuilders) {
            embeddingBuilder.buildAndRegister(client, embeddings, container, executionContext, eventTypes, logger, cancellation);
        }

        return embeddings;
    }
}

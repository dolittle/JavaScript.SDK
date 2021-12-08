// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';
import { Guid } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

import { EmbeddingsClient } from '@dolittle/runtime.contracts/Embeddings/Embeddings_grpc_pb';

import { IEventTypes } from '@dolittle/sdk.events';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { IProjectionAssociations } from '@dolittle/sdk.projections';

import { EmbeddingId } from '..';
import { IEmbedding, EmbeddingProcessor } from '../Internal';
import { EmbeddingBuilder } from './EmbeddingBuilder';
import { EmbeddingClassBuilder } from './EmbeddingClassBuilder';
import { IEmbeddingBuilder } from './IEmbeddingBuilder';
import { IEmbeddingsBuilder } from './IEmbeddingsBuilder';

/**
 * Represents an implementation of {@link IEmbeddingsBuilder}.
 */
export class EmbeddingsBuilder extends IEmbeddingsBuilder {
    private _callbackBuilders: EmbeddingBuilder[] = [];
    private _classBuilders: EmbeddingClassBuilder<any>[] = [];

    /**
     * Initialises a new instance of {@link EmbeddingsBuilder}.
     * @param {IProjectionAssociations} _projectionAssociations - The projection associations.
     */
    constructor(private readonly _projectionAssociations: IProjectionAssociations) {
        super();
    }

    /** @inheritdoc */
    createEmbedding(embeddingId: string | EmbeddingId | Guid): IEmbeddingBuilder {
        const builder = new EmbeddingBuilder(EmbeddingId.from(embeddingId), this._projectionAssociations);
        this._callbackBuilders.push(builder);
        return builder;
    }

    /** @inheritdoc */
    register<T = any>(type: Constructor<T>): IEmbeddingsBuilder;
    register<T = any>(instance: T): IEmbeddingsBuilder;
    register<T = any>(typeOrInstance: Constructor<T> | T): EmbeddingsBuilder {
        this._classBuilders.push(new EmbeddingClassBuilder<T>(typeOrInstance));
        this._projectionAssociations.associate<T>(typeOrInstance);
        return this;
    }

    /**
     * Builds all the embeddings created with the builder.
     * @param {EmbeddingsClient} client - The client to use to register embeddings.
     * @param {ExecutionContext} executionContext - The execution context of the client.
     * @param {IEventTypes} eventTypes - All registered event types.
     * @param {Logger} logger - The logger to use for logging.
     * @returns {EmbeddingProcessor[]} The built embedding processors.
     */
    build(
        client: EmbeddingsClient,
        executionContext: ExecutionContext,
        eventTypes: IEventTypes,
        logger: Logger
    ): EmbeddingProcessor<any>[] {
        const embeddings: IEmbedding<any>[] = [];

        for (const embeddingBuilder of this._callbackBuilders) {
            const embedding = embeddingBuilder.build(eventTypes, logger);
            if (embedding !== undefined) {
                embeddings.push(embedding);
            }
        }
        for (const embeddingBuilder of this._classBuilders) {
            const embedding = embeddingBuilder.build(eventTypes, logger);
            if (embedding !== undefined) {
                embeddings.push(embedding);
            }
        }

        return embeddings.map(embedding =>
            new EmbeddingProcessor(
                embedding,
                client,
                executionContext,
                eventTypes,
                logger));
    }
}

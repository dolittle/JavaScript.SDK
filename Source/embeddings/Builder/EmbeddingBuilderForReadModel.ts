// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';

import { IContainer } from '@dolittle/sdk.common';
import { EventTypeMap, IEventTypes } from '@dolittle/sdk.events';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { Cancellation } from '@dolittle/sdk.resilience';
import { Constructor } from '@dolittle/types';
import { KeySelector, OnMethodBuilder, ProjectionCallback } from '@dolittle/sdk.projections';

import { EmbeddingsClient } from '@dolittle/runtime.contracts/Embeddings/Embeddings_grpc_pb';

import { IEmbeddings, Embedding, EmbeddingCompareCallback, EmbeddingId } from '..';
import { EmbeddingProcessor } from '../Internal';

import { ICanBuildAndRegisterAnEmbedding } from './ICanBuildAndRegisterAnEmbedding';
import { EmbeddingAlreadyHasACompareMethod } from './EmbeddingAlreadyHasACompareMethod';

/**
 * Represents a builder for building {@link IEmbedding}.
 */
export class EmbeddingBuilderForReadModel<T> extends OnMethodBuilder<T> implements ICanBuildAndRegisterAnEmbedding {
    private _compareMethod?: EmbeddingCompareCallback<T> = undefined;

    /**
     * Initializes a new instance of {@link EmbeddingBuilder}.
     * @param {EmbeddingId} _embeddingId  The unique identifier of the embedding to build for
     */
    constructor(
        private _embeddingId: EmbeddingId,
        private _readModelTypeOrInstance: Constructor<T> | T) {
            super();
        }

    /**
     * Add a compare method for comparing the reviced and current states of the embedding.
     * @param {EmbeddingCompareCallback} callback Callback to call until the current state equals the received state.
     * @returns {EmbeddingBuilderForReadModel<T>}
     */
    compare(callback: EmbeddingCompareCallback<T>): EmbeddingBuilderForReadModel<T> {
        if (this._compareMethod) {
            throw new EmbeddingAlreadyHasACompareMethod(this._embeddingId);
        }
        this._compareMethod = callback;
        return this;
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

        const events = new EventTypeMap<[ProjectionCallback<T>, KeySelector]>();
        if (this.onMethods.length < 1) {
            logger.warn(`Failed to register embedding ${this._embeddingId}. No @on methods are configured`);
            return;
        }
        const allMethodsBuilt = this.tryAddOnMethods(eventTypes, events);
        if (!allMethodsBuilt) {
            logger.warn(`Failed to register embedding ${this._embeddingId}. Couldn't build the @on methods. Maybe an event type is handled twice?`);
            return;
        }
        if (this._compareMethod === undefined) {
            logger.warn(`Failed to register embedding ${this._embeddingId}. No @compare method defined.`);
            return;
        }
        const embedding = new Embedding<T>(this._embeddingId, this._readModelTypeOrInstance, events, this._compareMethod);
        embeddings.register<T>(
            new EmbeddingProcessor<T>(
                embedding,
                client,
                executionContext,
                eventTypes,
                logger
            ), cancellation);
    }
}

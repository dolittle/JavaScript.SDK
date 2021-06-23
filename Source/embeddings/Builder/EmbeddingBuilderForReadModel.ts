// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { EmbeddingsClient } from '@dolittle/runtime.contracts/Embeddings/Embeddings_grpc_pb';
import { IContainer } from '@dolittle/sdk.common';
import { EventTypeMap, IEventTypes } from '@dolittle/sdk.events';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { KeySelector, OnMethodBuilder } from '@dolittle/sdk.projections';
import { Cancellation } from '@dolittle/sdk.resilience';
import { Constructor } from '@dolittle/types';
import { Logger } from 'winston';
import { Embedding, EmbeddingCompareCallback, EmbeddingDeleteCallback, EmbeddingId, EmbeddingProjectCallback, IEmbeddings } from '..';
import { EmbeddingProcessor } from '../Internal';
import { EmbeddingAlreadyHasACompareMethod } from './EmbeddingAlreadyHasACompareMethod';
import { EmbeddingAlreadyHasADeleteMethod } from './EmbeddingAlreadyHasADeleteMethod';
import { ICanBuildAndRegisterAnEmbedding } from './ICanBuildAndRegisterAnEmbedding';

/**
 * Represents a builder for building {@link IEmbedding}.
 */
export class EmbeddingBuilderForReadModel<T> extends OnMethodBuilder<T, EmbeddingProjectCallback<T>> implements ICanBuildAndRegisterAnEmbedding {
    private _compareMethod?: EmbeddingCompareCallback<T> = undefined;
    private _deleteMethod?: EmbeddingDeleteCallback<T> = undefined;

    /**
     * Initializes a new instance of {@link EmbeddingBuilder}.
     * @param {EmbeddingId} _embeddingId  The unique identifier of the embedding to build for
     * @param {Constructor<T> | T} _readModelTypeOrInstance  The read model type or instance
     */
    constructor(
        private readonly _embeddingId: EmbeddingId,
        private readonly _readModelTypeOrInstance: Constructor<T> | T) {
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

    /**
     * Add a delete method for deleting the embedding.
     * @param {EmbeddingCompareCallback} callback Callback to call until the embedding has been deleted.
     * @returns {EmbeddingBuilderForReadModel<T>}
     */
    deleteMethod(callback: EmbeddingDeleteCallback<T>): EmbeddingBuilderForReadModel<T> {
        if (this._deleteMethod) {
            throw new EmbeddingAlreadyHasADeleteMethod(this._embeddingId);
        }
        this._deleteMethod = callback;
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
        const events = this.buildOnMethods(eventTypes, logger);
        const canRegister = this.canRegisterEmbedding(logger);
        if (!canRegister || !events) {
            return;
        }
        const embedding = new Embedding<T>(this._embeddingId, this._readModelTypeOrInstance, events, this._compareMethod!, this._deleteMethod!);
        embeddings.register<T>(
            new EmbeddingProcessor<T>(
                embedding,
                client,
                executionContext,
                eventTypes,
                logger
            ), cancellation);
    }

    private buildOnMethods(eventTypes: IEventTypes, logger: Logger) {
        const events = new EventTypeMap<[EmbeddingProjectCallback<T>, KeySelector]>();
        const allMethodsBuilt = this.tryAddOnMethods(eventTypes, events);
        if (!allMethodsBuilt) {
            logger.warn(`Failed to register embedding ${this._embeddingId}. Couldn't build the @on methods. Maybe an event type is handled twice?`);
            return false;
        }
        return events;
    }

    private canRegisterEmbedding(logger: Logger): boolean {
        if (this.onMethods.length < 1) {
            logger.warn(`Failed to register embedding ${this._embeddingId}. No @on methods are configured`);
            return false;
        }
        if (this._compareMethod === undefined) {
            logger.warn(`Failed to register embedding ${this._embeddingId}. No compare method defined.`);
            return false;
        }
        if (this._deleteMethod === undefined) {
            logger.warn(`Failed to register embedding ${this._embeddingId}. No delete method defined.`);
            return false;
        }
        return true;
    }
}

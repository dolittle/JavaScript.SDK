// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';

import { IEventTypes } from '@dolittle/sdk.events';
import { IContainer } from '@dolittle/sdk.common';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { Cancellation } from '@dolittle/sdk.resilience';
import { EmbeddingsClient } from '@dolittle/runtime.contracts/Embeddings/Embeddings_grpc_pb';
import { IEmbeddings } from '../Internal';

/**
 * Defines a system that can build and register an embedding.
 */
export interface ICanBuildAndRegisterAnEmbedding {

    /**
     * Builds and registers a embedding
     * @param {EmbeddingsClient} client The embeddings client.
     * @param {IEmbeddings} embeddings  The embeddings.
     * @param {IContainer} container The IoC container.
     * @param {ExcecutionContext} executionContext The execution context.
     * @param {IEventTypes} eventTypes The event types.
     * @param {Logger} logger The logger.
     * @param {Cancellation} cancellation The cancellation token.
     */
    buildAndRegister(
        client: EmbeddingsClient,
        embeddings: IEmbeddings,
        container: IContainer,
        executionContext: ExecutionContext,
        eventTypes: IEventTypes,
        logger: Logger,
        cancellation: Cancellation): void
}

// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { EventType } from '@dolittle/sdk.events';
import { Constructor } from '@dolittle/types';
import { DeleteReadModelInstance, EventSelector  } from '@dolittle/sdk.projections';
import { EmbeddingContext, EmbeddingId, EmbeddingProjectContext } from '..';

/**
 * Defines an embedding.
 */
export interface IEmbedding<TReadModel> {
    /**
     * Gets the {@link EmbeddingId} for the embedding.
     */
    readonly embeddingId: EmbeddingId;

    /**
     * Gets the read model type the embedding is for.
     */
    readonly readModelTypeOrInstance: Constructor<TReadModel> | TReadModel;

    /**
     * Gets the initial state of the embedding.
     */
    readonly initialState?: TReadModel;

    /**
     * Gets the events used by the embedding.
     */
    readonly events: Iterable<EventType>;

    /**
     * Handle an event and update a readmodel.
     * @param {T} readModel ReadModel to update.
     * @param {*} event Event to handle.
     * @param {EventType} eventType The event type.
     * @param {EmbeddingProjectContext} context The context for the embedding processing.
     */
    on(readModel: TReadModel, event: any, eventType: EventType, context: EmbeddingProjectContext): Promise<TReadModel | DeleteReadModelInstance> | TReadModel | DeleteReadModelInstance;

    /**
     * Compares the received state and current state.
     * @param {T} receivedState The received state.
     * @param {T} currentState The current state.
     * @param {EmbeddingContext} context EmbeddingContext
     * @returns {any | any[]} One or more events to correct the state towards the wanted state.
     */
    compare(receivedState: TReadModel, currentState: TReadModel, context: EmbeddingContext): any | any[];

    /**
     * Called, when the readmodel should get deleted. Returns events, that should result in the readmodels deletion.
     * @param {T} currentState The received state.
     * @param {EmbeddingContext} context EmbeddingContext
     */
    delete(currentState: TReadModel, context: EmbeddingContext): any | any[];
}

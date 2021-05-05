// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { EventType } from '@dolittle/sdk.events';
import { Constructor } from '@dolittle/types';

import { DeleteReadModelInstance, EventSelector  } from '@dolittle/sdk.projections';
import { EmbeddingContext } from './EmbeddingContext';
import { EmbeddingId } from './EmbeddingId';
import { EmbeddingProjectContext } from './EmbeddingProjectContext';

/**
 * Defines an embedding.
 */
export interface IEmbedding<T> {
    /**
     * Gets the {@link EmbeddingId} for the embedding.
     */
    readonly embeddingId: EmbeddingId;

    /**
     * Gets the read model type the embedding is for.
     */
    readonly readModelTypeOrInstance: Constructor<T> | T;

    /**
     * Gets the initial state of the embedding.
     */
    readonly initialState?: T;

    /**
     * Gets the events used by the embedding.
     */
    readonly events: Iterable<EventSelector>;

    /**
     * Handle an event and update a readmodel.
     * @param {T} readModel ReadModel to update.
     * @param {*} event Event to handle.
     * @param {EventType} eventType The event type.
     * @param {EmbeddingProjectContext} context The context for the embedding processing.
     */
    on(readModel: T, event: any, eventType: EventType, context: EmbeddingProjectContext): Promise<T | DeleteReadModelInstance> | T | DeleteReadModelInstance;

    /**
     * Compares the received state and current state.
     * @param {T} receivedState The received state.
     * @param {T} currentState The current state.
     * @param {EmbeddingContext} context EmbeddingContext
     * @returns {any | any[]} One or more events to correct the state towards the wanted state.
     */
    compare(receivedState: T, currentState: T, context: EmbeddingContext): any | any[];

    /**
     * Called, when the readmodel should get deleted. Returns events, that should result in the readmodels deletion.
     * @param {T} currentState The received state.
     * @param {EmbeddingContext} context EmbeddingContext
     */
    delete(currentState: T, context: EmbeddingContext): any | any[];
}

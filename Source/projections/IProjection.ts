// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { EventType, ScopeId } from '@dolittle/sdk.events';
import { Constructor } from '@dolittle/types';
import { DeleteReadModelInstance } from './DeleteReadModelInstance';
import { EventSelector } from './EventSelector';
import { ProjectionContext } from './ProjectionContext';
import { ProjectionId } from './ProjectionId';

/**
 * Defines a projection.
 * @template T The type of the projection read model.
 */
export abstract class IProjection<T> {
    /**
     * Gets the {@link ProjectionId} for the projection.
     */
    abstract readonly projectionId: ProjectionId;

    /**
     * Gets the read model type the projection is for.
     */
    abstract readonly readModelTypeOrInstance: Constructor<T> | T;

    /**
     * Gets the initial state of the projection.
     */
    abstract readonly initialState?: T;

    /**
     * Gets the scope the projection is in.
     */
    abstract readonly scopeId: ScopeId;

    /**
     * Gets the events used by the projection.
     */
    abstract readonly events: Iterable<EventSelector>;

    /**
     * Handle an event and update a readmodel.
     * @param {T} readModel - ReadModel to update.
     * @param {*} event - Event to handle.
     * @param {EventType} eventType - The event type.
     * @param {ProjectionContext} context - The context for the projection processing.
     */
    abstract on(readModel: T, event: any, eventType: EventType, context: ProjectionContext): Promise<T | DeleteReadModelInstance> | T | DeleteReadModelInstance;
}

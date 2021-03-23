// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { EventContext, EventType, ScopeId } from '@dolittle/sdk.events';
import { Constructor } from '@dolittle/types';
import { ProjectionId } from './ProjectionId';

/**
 * Defines a projection
 */
export interface IProjection {
    /**
     * Gets the unique identifier for a projection - {@link ProjectionId}
     */
    readonly projectionId: ProjectionId;

    /**
     * Gets the readmodel the projection is for
     */
    readonly readModel: Constructor<any>;

    /**
     * Gets the scope the projection is in
     */
    readonly scopeId: ScopeId;

    /**
     * Gets the event types that are handled by this projection
     */
    readonly handledEvents: Iterable<EventType>;

    /**
     * Handle an event and update a readmodel.
     * @param {*} readModel ReadModel to update.
     * @param {*} event Event to handle.
     * @param {EventType} eventType The event type.
     * @param {EventContext} context The context in which the event is in.
     */
    on(readModel: any, event: any, eventType: EventType, context: EventContext): Promise<void>;
}

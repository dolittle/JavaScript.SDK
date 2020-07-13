// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Artifact } from '@dolittle/sdk.artifacts';
import { EventContext } from '@dolittle/sdk.events';
import { ScopeId } from './ScopeId';
import { EventHandlerId } from './EventHandlerId';

/**
 * Defines an event handler
 */
export interface IEventHandler {
    /**
     * Gets the unique identifier for event handler - {@link EventHandlerId}
     */
    readonly eventHandlerId: EventHandlerId;

    /**
     * Gets the scope the event handler is in
     */
    readonly scopeId: ScopeId;

    /**
     * Gets whether or not the event handler is partitioned.
     */
    readonly partitioned: boolean;

    /**
     * Gets the event types identified by its artifact that is handled by this event handler.
     */
    readonly handledEvents: Iterable<Artifact>;

    /**
     * Handle an event.
     * @param {*} event Event to handle.
     * @param {Artifact} artifact The artifact representing the event type.
     * @param {EventContext} context The context in which the event is in.
     */
    handle(event: any, artifact: Artifact, context: EventContext): void;
}

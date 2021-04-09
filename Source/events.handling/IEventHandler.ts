// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { EventContext, EventType, ScopeId } from '@dolittle/sdk.events';

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
    readonly handledEvents: Iterable<EventType>;

    /**
     * Handle an event.
     * @param {*} event Event to handle.
     * @param {EventType} eventType The event type.
     * @param {EventContext} context The context in which the event is in.
     */
    handle(event: any, eventType: EventType, context: EventContext): Promise<void>;
}

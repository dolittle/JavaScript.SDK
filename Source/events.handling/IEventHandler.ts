// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { EventContext, EventType, ScopeId } from '@dolittle/sdk.events';
import { EventHandlerAlias } from './EventHandlerAlias';
import { EventHandlerId } from './EventHandlerId';

/**
 * Defines an event handler
 */
export abstract class IEventHandler {
    /**
     * Gets the unique identifier for event handler - {@link EventHandlerId}
     */
    abstract readonly eventHandlerId: EventHandlerId;

    /**
     * Gets the scope the event handler is in
     */
    abstract readonly scopeId: ScopeId;

    /**
     * Gets whether or not the event handler is partitioned.
     */
    abstract readonly partitioned: boolean;

    /**
     * Gets the event types identified by its artifact that is handled by this event handler.
     */
    abstract readonly handledEvents: Iterable<EventType>;

    /**
     * Gets the alias for the event handler.
     */
    abstract readonly alias: EventHandlerAlias | undefined;

    /**
     * Gets a value indicating whether this event handler has an alias or not.
     */
    abstract readonly hasAlias: boolean;

    /**
     * Handle an event.
     * @param {*} event Event to handle.
     * @param {EventType} eventType The event type.
     * @param {EventContext} context The context in which the event is in.
     */
    abstract handle(event: any, eventType: EventType, context: EventContext): Promise<void>;
}

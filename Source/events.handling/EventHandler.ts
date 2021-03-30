// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { EventContext, EventType, EventTypeMap, ScopeId } from '@dolittle/sdk.events';

import { IEventHandler } from './IEventHandler';
import { EventHandlerSignature } from './EventHandlerSignature';
import { MissingEventHandlerForType } from './MissingEventHandlerForType';
import { EventHandlerId } from './EventHandlerId';

/**
 * Represents an implementation of {@link IEventHandler}.
 */
export class EventHandler implements IEventHandler {

    /**
     * Initializes a new instance of {@link EventHandler}
     * @param {EventHandlerId} eventHandlerId The unique identifier of the event handler.
     * @param {ScopeId} scopeId The identifier of the scope the event handler is in.
     * @param {boolean} partitioned Whether or not the event handler is partitioned.
     * @param {EventTypeMap<EventHandlerSignature<any>>} handleMethodsByEventType Handle methods per event type.
     */
    constructor(
        readonly eventHandlerId: EventHandlerId,
        readonly scopeId: ScopeId,
        readonly partitioned: boolean,
        readonly handleMethodsByEventType: EventTypeMap<EventHandlerSignature<any>>) {
    }

    /** @inheritdoc */
    get handledEvents(): Iterable<EventType> {
        return this.handleMethodsByEventType.keys();
    }

    /** @inheritdoc */
    async handle(event: any, eventType: EventType, context: EventContext): Promise<void> {
        if (this.handleMethodsByEventType.has(eventType)) {
            const method = this.handleMethodsByEventType.get(eventType)!;
            await method(event, context);
        } else {
            throw new MissingEventHandlerForType(eventType);
        }
    }
}

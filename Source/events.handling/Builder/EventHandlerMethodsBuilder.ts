// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';

import { Guid } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

import { EventType, EventTypeId, EventTypeMap, IEventTypes } from '@dolittle/sdk.artifacts';

import { EventHandlerId, EventHandlerSignature } from '../index';

type TypeOrEventTypeOrId = Constructor<any> | EventType | Guid | string;
type TypeToMethodPair = [TypeOrEventTypeOrId, EventHandlerSignature<any>];
export class EventHandlerMethodsBuilder {

    private readonly _typeToMethodPairs: TypeToMethodPair[];

    constructor(private readonly _eventHandlerId: EventHandlerId) {
        this._typeToMethodPairs = [];
    }

    /**
     * Add a handler method for handling the event.
     * @template T Type of event, when using type rather than artifact - default is any.
     * @param {Constructor<T>|EventType|Guid|string} typeOrEventTypeOrId The type of event or the artifact or identifier of the artifact.
     * @param {EventHandlerSignature<T>} method Method to call for each event.
     */
    handle<T = any>(typeOrEventTypeOrId: Constructor<T> | EventType | Guid | string, method: EventHandlerSignature<T>) {
        this._typeToMethodPairs.push([typeOrEventTypeOrId, method]);
    }


    tryAddEventHandlerMethods(eventTypes: IEventTypes, eventTypeToMethods: EventTypeMap<EventHandlerSignature<any>>, logger: Logger): boolean {
        let allMethodsValid = true;
        for (const [typeOrEventTypeOrId, method] of this._typeToMethodPairs){
            const eventType = this.getEventType(typeOrEventTypeOrId, eventTypes);
            if (eventTypeToMethods.has(eventType)) {
                allMethodsValid = false;
                logger.warning(`Event handler ${this._eventHandlerId} already handles event with event type ${eventType}`);
            }
            eventTypeToMethods.set(eventType, method);
        }
        return allMethodsValid;
    }

    private getEventType(typeOrEventTypeOrId: TypeOrEventTypeOrId, eventTypes: IEventTypes): EventType {
        let eventType: EventType;
        if (typeOrEventTypeOrId instanceof EventType) {
            eventType = typeOrEventTypeOrId;
        } else if (typeOrEventTypeOrId instanceof Guid || typeof typeOrEventTypeOrId === 'string') {
            eventType = new EventType(EventTypeId.from(typeOrEventTypeOrId));
        } else {
            eventType = eventTypes.getFor(typeOrEventTypeOrId);
        }
        return eventType;
    }
}
// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';

import { Guid } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

import { EventType, EventTypeId, EventTypeMap, IEventTypes } from '@dolittle/sdk.events';

import { EventHandlerId, EventHandlerSignature } from '..';
import { Generation, GenerationLike } from '@dolittle/sdk.artifacts';

type TypeOrEventType = Constructor<any> | EventType;
type TypeToMethodPair = [TypeOrEventType, EventHandlerSignature<any>];
export class EventHandlerMethodsBuilder {

    private readonly _typeToMethodPairs: TypeToMethodPair[];

    constructor(private readonly _eventHandlerId: EventHandlerId) {
        this._typeToMethodPairs = [];
    }

    /**
     * Add a handler method for handling the event.
     * @template T Type of event.
     * @param {Constructor<T>} type The type of event.
     * @param {EventHandlerSignature<T>} method Method to call for each event.
     */
    handle<T>(type: Constructor<T>, method: EventHandlerSignature<T>): void;
    /**
     * Add a handler method for handling the event.
     * @param {EventType} eventType The identifier of the event.
     * @param {EventHandlerSignature<T>} method Method to call for each event.
     */
    handle(eventType: EventType, method: EventHandlerSignature): void;
    /**
     * Add a handler method for handling the event.
     * @param {EventTypeId|Guid|string} eventType The identifier of the event.
     * @param {EventHandlerSignature<T>} method Method to call for each event.
     */
    handle(eventTypeId: EventTypeId | Guid | string, method: EventHandlerSignature): void;
    /**
     * Add a handler method for handling the event.
     * @param {EventTypeId | Guid | string} eventType The identifier of the event.
     * @param {Generation | number} generation The generation of the event type.
     * @param {EventHandlerSignature<T>} method Method to call for each event.
     */
    handle(eventTypeId: EventTypeId | Guid | string, generation: GenerationLike, method: EventHandlerSignature): void;
    handle<T = any>(typeOrEventTypeOrId: Constructor<T> | EventType | EventTypeId | Guid | string, methodOrGeneration: EventHandlerSignature<T> | GenerationLike, maybeMethod?: EventHandlerSignature<T>) {
        const method = maybeMethod || methodOrGeneration as EventHandlerSignature<T>;

        if (typeOrEventTypeOrId instanceof EventType) {
            this._typeToMethodPairs.push([typeOrEventTypeOrId, method]);
        } else if (typeOrEventTypeOrId instanceof EventTypeId || typeOrEventTypeOrId instanceof Guid || typeof typeOrEventTypeOrId === 'string') {
            let generation = Generation.first;
            if (methodOrGeneration instanceof Generation || typeof methodOrGeneration === 'number') {
                generation = Generation.from(methodOrGeneration);
            }
            this._typeToMethodPairs.push([new EventType(EventTypeId.from(typeOrEventTypeOrId), generation), method]);
        } else {
            this._typeToMethodPairs.push([typeOrEventTypeOrId, method]);
        }
    }

    tryAddEventHandlerMethods(eventTypes: IEventTypes, eventTypeToMethods: EventTypeMap<EventHandlerSignature<any>>, logger: Logger): boolean {
        let allMethodsValid = true;
        for (const [typeOrEventTypeOrId, method] of this._typeToMethodPairs){
            const eventType = this.getEventType(typeOrEventTypeOrId, eventTypes);
            if (eventTypeToMethods.has(eventType)) {
                allMethodsValid = false;
                logger.warn(`Event handler ${this._eventHandlerId} already handles event with event type ${eventType}`);
            }
            eventTypeToMethods.set(eventType, method);
        }
        return allMethodsValid;
    }

    private getEventType(typeOrEventTypeOrId: TypeOrEventType, eventTypes: IEventTypes): EventType {
        let eventType: EventType;
        if (typeOrEventTypeOrId instanceof EventType) {
            eventType = typeOrEventTypeOrId;
        } else {
            eventType = eventTypes.getFor(typeOrEventTypeOrId);
        }
        return eventType;
    }
}

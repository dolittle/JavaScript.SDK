// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

import { IClientBuildResults } from '@dolittle/sdk.common';
import { Generation, GenerationLike } from '@dolittle/sdk.artifacts';
import { EventType, EventTypeId, EventTypeMap, IEventTypes } from '@dolittle/sdk.events';

import { EventHandlerId } from '../EventHandlerId';
import { EventHandlerSignature } from '../EventHandlerSignature';
import { IEventHandlerMethodsBuilder } from './IEventHandlerMethodsBuilder';

type TypeOrEventType = Constructor<any> | EventType;
type TypeToMethodPair = [TypeOrEventType, EventHandlerSignature<any>];

/**
 * Represents an implementation of {@link IEventHandlerMethodsBuilder}.
 */
export class EventHandlerMethodsBuilder extends IEventHandlerMethodsBuilder {
    private readonly _typeToMethodPairs: TypeToMethodPair[];

    /**
     * Initialises a new instance of the {@link EventHandlerMethodsBuilder} class.
     * @param {EventHandlerId} _eventHandlerId - The event handler id to build methods for.
     */
    constructor(private readonly _eventHandlerId: EventHandlerId) {
        super();
        this._typeToMethodPairs = [];
    }

    /** @inheritdoc */
    handle<T>(type: Constructor<T>, method: EventHandlerSignature<T>): void;
    handle(eventType: EventType, method: EventHandlerSignature<any>): void;
    handle(eventTypeId: string | EventTypeId | Guid, method: EventHandlerSignature<any>): void;
    handle(eventTypeId: string | EventTypeId | Guid, generation: GenerationLike, method: EventHandlerSignature<any>): void;
    handle<T = any>(typeOrEventTypeOrId: Constructor<T> | EventType | EventTypeId | Guid | string, methodOrGeneration: EventHandlerSignature<T> | GenerationLike, maybeMethod?: EventHandlerSignature<T>) {
        const method = maybeMethod || methodOrGeneration as EventHandlerSignature<T>;

        if (typeOrEventTypeOrId instanceof EventType) {
            this._typeToMethodPairs.push([typeOrEventTypeOrId, method]);
        } else if (typeOrEventTypeOrId instanceof EventTypeId || typeOrEventTypeOrId instanceof Guid || typeof typeOrEventTypeOrId === 'string') {
            let generation = Generation.first;
            if (methodOrGeneration instanceof Generation || typeof methodOrGeneration === 'number') {
                generation = Generation.from(methodOrGeneration);
            }
            this._typeToMethodPairs.push([new EventType(EventTypeId.from(typeOrEventTypeOrId), generation), method]);
        } else {
            this._typeToMethodPairs.push([typeOrEventTypeOrId, method]);
        }
    }

    /**
     * Tries to add event handler methods to the builder.
     * @param {IEventTypes} eventTypes - All registered event types.
     * @param {EventTypeMap<EventHandlerSignature<any>>} eventTypeToMethods - The event handler methods to add by event type.
     * @param {IClientBuildResults} results - For keeping track of build results.
     * @returns {boolean} A value indicating whether all provided methods were added or not.
     */
    tryAddEventHandlerMethods(eventTypes: IEventTypes, eventTypeToMethods: EventTypeMap<EventHandlerSignature<any>>, results: IClientBuildResults): boolean {
        let allMethodsValid = true;
        for (const [typeOrEventTypeOrId, method] of this._typeToMethodPairs){
            const eventType = this.getEventType(typeOrEventTypeOrId, eventTypes);
            if (eventTypeToMethods.has(eventType)) {
                allMethodsValid = false;
                results.addFailure(`Event handler ${this._eventHandlerId} already handles event with event type ${eventType}`);
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

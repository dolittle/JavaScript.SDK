// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

import { GenerationLike } from '@dolittle/sdk.artifacts';
import { EventType, EventTypeId } from '@dolittle/sdk.events';

import { EventHandlerSignature } from '..';

/**
 * Defines a builder for building event handler methods from callbacks.
 */
export abstract class IEventHandlerMethodsBuilder {
    /**
     * Add a handler method for handling the event.
     * @param {Constructor<T>} type - The type of event.
     * @param {EventHandlerSignature<T>} method - Method to call for each event.
     * @template T Type of event.
     */
    abstract handle<T>(type: Constructor<T>, method: EventHandlerSignature<T>): void;
    /**
     * Add a handler method for handling the event.
     * @param {EventType} eventType - The identifier of the event.
     * @param {EventHandlerSignature} method - Method to call for each event.
     */
    abstract handle(eventType: EventType, method: EventHandlerSignature): void;
    /**
     * Add a handler method for handling the event.
     * @param {EventTypeId|Guid|string} eventType - The identifier of the event.
     * @param {EventHandlerSignature} method - Method to call for each event.
     */
    abstract handle(eventTypeId: EventTypeId | Guid | string, method: EventHandlerSignature): void;
    /**
     * Add a handler method for handling the event.
     * @param {EventTypeId | Guid | string} eventType - The identifier of the event.
     * @param {GenerationLike} generation - The generation of the event type.
     * @param {EventHandlerSignature} method - Method to call for each event.
     */
     abstract handle(eventTypeId: EventTypeId | Guid | string, generation: GenerationLike, method: EventHandlerSignature): void;
}

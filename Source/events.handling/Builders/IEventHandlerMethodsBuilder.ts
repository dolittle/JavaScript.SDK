// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';

import { GenerationLike } from '@dolittle/sdk.artifacts';
import { EventType, EventTypeIdLike } from '@dolittle/sdk.events';

import { EventHandlerSignature } from '../EventHandlerSignature';

/**
 * Defines a builder for building event handler methods from callbacks.
 */
export abstract class IEventHandlerMethodsBuilder {
    /**
     * Add a handler method for handling the event.
     * @param {Constructor<T>} type - The type of event.
     * @param {EventHandlerSignature<T>} method - Method to call for each event.
     * @returns {IEventHandlerMethodsBuilder} The builder for continuation.
     * @template T Type of event.
     */
    abstract handle<T>(type: Constructor<T>, method: EventHandlerSignature<T>): IEventHandlerMethodsBuilder;
    /**
     * Add a handler method for handling the event.
     * @param {EventType} eventType - The identifier of the event.
     * @param {EventHandlerSignature} method - Method to call for each event.
     * @returns {IEventHandlerMethodsBuilder} The builder for continuation.
     */
    abstract handle(eventType: EventType, method: EventHandlerSignature): IEventHandlerMethodsBuilder;
    /**
     * Add a handler method for handling the event.
     * @param {EventTypeIdLike} eventType - The identifier of the event.
     * @param {EventHandlerSignature} method - Method to call for each event.
     * @returns {IEventHandlerMethodsBuilder} The builder for continuation.
     */
    abstract handle(eventTypeId: EventTypeIdLike, method: EventHandlerSignature): IEventHandlerMethodsBuilder;
    /**
     * Add a handler method for handling the event.
     * @param {EventTypeIdLike} eventType - The identifier of the event.
     * @param {GenerationLike} generation - The generation of the event type.
     * @param {EventHandlerSignature} method - Method to call for each event.
     * @returns {IEventHandlerMethodsBuilder} The builder for continuation.
     */
     abstract handle(eventTypeId: EventTypeIdLike, generation: GenerationLike, method: EventHandlerSignature): IEventHandlerMethodsBuilder;
}

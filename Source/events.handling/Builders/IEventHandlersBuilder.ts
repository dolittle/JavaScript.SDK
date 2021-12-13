// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

import { EventHandlerId } from '../EventHandlerId';
import { EventHandlerBuilderCallback } from './EventHandlerBuilderCallback';

/**
 * Defines a builder that can build event handlers.
 */
export abstract class IEventHandlersBuilder {
    /**
     * Start building an event handler.
     * @param {EventHandlerId | Guid | string} eventHandlerId - The unique identifier of the event handler.
     * @param {EventHandlerBuilderCallback} callback - Callback for building out the event handler.
     * @returns {IEventHandlersBuilder} The builder for continuation.
     */
    abstract createEventHandler(eventHandlerId: EventHandlerId | Guid | string, callback: EventHandlerBuilderCallback): IEventHandlersBuilder;

    /**
     * Register a type as an event handler.
     * @param type - The type to register as an event handler.
     */
    abstract registerEventHandler<T = any>(type: Constructor<T>): IEventHandlersBuilder;

    /**
     * Register an instance as an event handler.
     * @param instance - The instance to register as an event handler.
     */
    abstract registerEventHandler<T = any>(instance: T): IEventHandlersBuilder;
}

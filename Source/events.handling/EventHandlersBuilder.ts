// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IEventHandlers } from './IEventHandlers';
import { EventHandlers } from './EventHandlers';
import { EventHandlerSignature } from './EventHandlerMethod';

export type EventHandlersBuilderCallback = (builder: EventHandlersBuilder) => void;

/**
 * Represents the builder for configuring event handlers
 */
export class EventHandlersBuilder {

    /**
     * Event handler methods
     * @param {...Function[]} types Event handler types
     */
    from(...types: Function[]) {
        debugger;
        console.log('Yup');
    }

    /**
     * Builds an instance for holding event handlers.
     * @returns {IEventHandlers} New instance.
     */
    build(): IEventHandlers {
        const eventHandlers = new EventHandlers();
        return eventHandlers;
    }
}

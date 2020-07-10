// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';

import { IExecutionContextManager } from '@dolittle/sdk.execution';
import { IArtifacts } from '@dolittle/sdk.artifacts';

import { EventHandlersClient } from '@dolittle/runtime.contracts/Runtime/Events.Processing/EventHandlers_grpc_pb';

import { IEventHandlers } from './IEventHandlers';
import { EventHandlers } from './EventHandlers';
import { EventHandlerId } from './EventHandlerId';
import { EventHandlerBuilder, EventHandlerBuilderCallback } from './EventHandlerBuilder';

export type EventHandlersBuilderCallback = (builder: EventHandlersBuilder) => void;

/**
 * Represents the builder for configuring event handlers
 */
export class EventHandlersBuilder {
    private _eventHandlers: Map<EventHandlerId, EventHandlerBuilder> = new Map();


    /**
     * Event handler methods
     * @param {...Function[]} types Event handler types
     */
    from(...types: Function[]): void {
        console.log('');
    }

    /**
     * Start building an event handler.
     * @param {EventHandlerId} eventHandlerId The unique identifier of the event handler.
     * @param {EventHandlerBuilderCallback} callback Callback for building out the event handler.
     */
    for(eventHandlerId: EventHandlerId, callback: EventHandlerBuilderCallback ): void {
        const builder = new EventHandlerBuilder(eventHandlerId);
        callback(builder);
        this._eventHandlers.set(eventHandlerId, builder);
    }

    /**
     * Builds an instance for holding event handlers.
     * @returns {IEventHandlers} New instance.
     */
    build(client: EventHandlersClient, executionContextManager: IExecutionContextManager, artifacts: IArtifacts, logger: Logger): IEventHandlers {
        const eventHandlers = new EventHandlers(client, executionContextManager, artifacts, logger);

        for ( const [eventHandlerId, eventHandlerBuilder] of this._eventHandlers ) {
            const eventHandler = eventHandlerBuilder.build(artifacts);
            eventHandlers.register(eventHandlerId, eventHandlerBuilder.scopeId, eventHandlerBuilder.isPartitioned, eventHandler);
        }

        return eventHandlers;
    }
}

// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';

import { Guid } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

import { IEventTypes } from '@dolittle/sdk.artifacts';
import { IContainer } from '@dolittle/sdk.common';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { Cancellation } from '@dolittle/sdk.resilience';

import { EventHandlersClient } from '@dolittle/runtime.contracts/Runtime/Events.Processing/EventHandlers_grpc_pb';

import { IEventHandlers } from './IEventHandlers';
import { EventHandlerId } from './EventHandlerId';
import { EventHandlerBuilder, EventHandlerBuilderCallback } from './EventHandlerBuilder';
import { EventHandlers } from './EventHandlers';
import { EventHandlerProcessor } from './Internal';

export type EventHandlersBuilderCallback = (builder: EventHandlersBuilder) => void;

/**
 * Represents the builder for configuring event handlers
 */
export class EventHandlersBuilder {
    private _eventHandlerBuilders: EventHandlerBuilder[] = [];

    /**
     * Start building an event handler.
     * @param {Guid | string} eventHandlerId The unique identifier of the event handler.
     * @param {EventHandlerBuilderCallback} callback Callback for building out the event handler.
     */
    createEventHandler(eventHandlerId: Guid | string, callback: EventHandlerBuilderCallback): EventHandlersBuilder {
        const id = EventHandlerId.from(eventHandlerId);
        const builder = new EventHandlerBuilder(id);
        callback(builder);
        this._eventHandlerBuilders.push(builder);
        return this;
    }

    registerEventHandler<T = any>(type: Constructor<T>, instance?: T): void {

        return this;
    }

    /**
     * Builds an instance for holding event handlers.
     * @returns {IEventHandlers} New instance.
     */
    buildAndRegister(
        client: EventHandlersClient,
        container: IContainer,
        executionContext: ExecutionContext,
        eventTypes: IEventTypes,
        logger: Logger,
        cancellation: Cancellation): IEventHandlers {
        const eventHandlers = new EventHandlers(logger);

        for (const eventHandlerBuilder of this._eventHandlerBuilders) {
            const [eventHandler, succeeded] = eventHandlerBuilder.tryBuild(eventTypes, logger);
            if (succeeded) {
                eventHandlers.register(
                    new EventHandlerProcessor(
                        eventHandler,
                        client,
                        executionContext,
                        eventTypes,
                        logger),
                    cancellation);

            } else logger.warning(``);
        }

        return eventHandlers;
    }
}

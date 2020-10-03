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

import { EventHandlerId, EventHandlers, IEventHandlers } from '../index';
import { EventHandlerBuilder, EventHandlerBuilderCallback } from './EventHandlerBuilder';
import { EventHandlerClassBuilder } from './EventHandlerClassBuilder';
import { ICanBuildAndRegisterAnEventHandler } from './ICanBuildAndRegisterAnEventHandler';

export type EventHandlersBuilderCallback = (builder: EventHandlersBuilder) => void;

/**
 * Represents the builder for configuring event handlers
 */
export class EventHandlersBuilder {
    private _eventHandlerBuilders: ICanBuildAndRegisterAnEventHandler[] = [];

    /**
     * Start building an event handler.
     * @param {Guid | string} eventHandlerId The unique identifier of the event handler.
     * @param {EventHandlerBuilderCallback} callback Callback for building out the event handler.
     */
    createEventHandler(eventHandlerId: Guid | string, callback: EventHandlerBuilderCallback): EventHandlersBuilder {
        const builder = new EventHandlerBuilder(EventHandlerId.from(eventHandlerId));
        callback(builder);
        this._eventHandlerBuilders.push(builder);
        return this;
    }

    register<T = any>(typeOrInstance: Constructor<T> | T): EventHandlersBuilder {
        this._eventHandlerBuilders.push(new EventHandlerClassBuilder(typeOrInstance));
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
            eventHandlerBuilder.buildAndRegister(client, eventHandlers, container, executionContext, eventTypes, logger, cancellation);
        }

        return eventHandlers;
    }
}

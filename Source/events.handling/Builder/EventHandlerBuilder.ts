// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';

import { Guid } from '@dolittle/rudiments';
import { EventTypeMap, IEventTypes, ScopeId } from '@dolittle/sdk.events';
import { EventHandlersClient } from '@dolittle/runtime.contracts/Events.Processing/EventHandlers_grpc_pb';
import { Cancellation } from '@dolittle/sdk.resilience';
import { ExecutionContext } from '@dolittle/sdk.execution';

import { EventHandler, EventHandlerId, EventHandlerSignature, IEventHandlers } from '..';
import { EventHandlerProcessor } from '../Internal';

import { EventHandlerMethodsBuilder } from './EventHandlerMethodsBuilder';
import { ICanBuildAndRegisterAnEventHandler } from './ICanBuildAndRegisterAnEventHandler';
import { IContainer } from '@dolittle/sdk.common';

export type EventHandlerBuilderCallback = (builder: EventHandlerBuilder) => void;

/**
 * Represents a builder for building {@link IEventHandler} - event handlers.
 */
export class EventHandlerBuilder implements ICanBuildAndRegisterAnEventHandler {
    private _methodsBuilder?: EventHandlerMethodsBuilder;
    private _scopeId: ScopeId = ScopeId.default;
    private _partitioned!: boolean;

    /**
     * Initializes a new instance of {@link EventHandlerBuilder}.
     * @param {EventHandlerId} _eventHandlerId The unique identifier of the event handler to build for.
     */
    constructor(private _eventHandlerId: EventHandlerId) {
    }

    /**
     * Defines the event handler to be partitioned - this is default for a event handler.
     * @returns {EventHandlerBuilder}
     */
    partitioned(): EventHandlerMethodsBuilder {
        this._partitioned = true;
        this._methodsBuilder = new EventHandlerMethodsBuilder(this._eventHandlerId);
        return this._methodsBuilder;
    }

    /**
     * Defines the event handler to be unpartitioned. By default it will be partitioned.
     * @returns {EventHandlerBuilder}
     */
    unpartitioned(): EventHandlerMethodsBuilder {
        this._partitioned = false;
        this._methodsBuilder = new EventHandlerMethodsBuilder(this._eventHandlerId);
        return this._methodsBuilder;
    }

    /**
     * Defines the event handler to operate on a specific {@link ScopeId}.
     * @param {ScopeId | Guid | string} scopeId Scope the event handler operates on.
     * @returns {EventHandlerBuilder}
     */
    inScope(scopeId: ScopeId | Guid | string): EventHandlerBuilder {
        this._scopeId = ScopeId.from(scopeId);
        return this;
    }

    /** @inheritdoc */
    buildAndRegister(
        client: EventHandlersClient,
        eventHandlers: IEventHandlers,
        container: IContainer,
        executionContext: ExecutionContext,
        eventTypes: IEventTypes,
        logger: Logger,
        cancellation: Cancellation): void {
        const eventTypeToMethods = new EventTypeMap<EventHandlerSignature<any>>();
        if (this._methodsBuilder === undefined) {
            logger.warn(`Failed to build event handler ${this._eventHandlerId}. No event handler methods are configured for event handler`);
            return;
        }
        const allMethodsBuilt = this._methodsBuilder.tryAddEventHandlerMethods(eventTypes, eventTypeToMethods, logger);
        if (!allMethodsBuilt) {
            logger.warn(`Could not build event handler ${this._eventHandlerId}`);
            return;
        }
        const eventHandler = new EventHandler(this._eventHandlerId, this._scopeId, this._partitioned, eventTypeToMethods);
        eventHandlers.register(
            new EventHandlerProcessor(
                eventHandler,
                client,
                executionContext,
                eventTypes,
                logger
            ), cancellation);
    }
}

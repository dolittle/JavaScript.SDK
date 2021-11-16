// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { EventHandlersClient } from '@dolittle/runtime.contracts/Events.Processing/EventHandlers_grpc_pb';
import { IContainer } from '@dolittle/sdk.common';
import { EventTypeMap, IEventTypes, ScopeId } from '@dolittle/sdk.events';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { Cancellation } from '@dolittle/sdk.resilience';
import { Logger } from 'winston';
import { EventHandler, EventHandlerAlias, EventHandlerAliasLike, EventHandlerId, EventHandlerSignature, IEventHandlers } from '..';
import { EventHandlerProcessor } from '../Internal';
import { EventHandlerMethodsBuilder } from './EventHandlerMethodsBuilder';
import { ICanBuildAndRegisterAnEventHandler } from './ICanBuildAndRegisterAnEventHandler';

/**
 * Defines the callback for building instances of {@link IEventHandler}.
 */
export type EventHandlerBuilderCallback = (builder: EventHandlerBuilder) => void;

/**
 * Represents a builder for building instances of {@link IEventHandler}.
 */
export class EventHandlerBuilder extends ICanBuildAndRegisterAnEventHandler {
    private _methodsBuilder?: EventHandlerMethodsBuilder;
    private _scopeId: ScopeId = ScopeId.default;
    private _alias?: EventHandlerAlias;
    private _partitioned!: boolean;

    /**
     * Initializes a new instance of {@link EventHandlerBuilder}.
     * @param {EventHandlerId} _eventHandlerId - The unique identifier of the event handler to build for.
     */
    constructor(private _eventHandlerId: EventHandlerId) {
        super();
    }

    /**
     * Defines the event handler to be partitioned - this is default for a event handler.
     * @returns {EventHandlerBuilder} The builder for continuation.
     */
    partitioned(): EventHandlerMethodsBuilder {
        this._partitioned = true;
        this._methodsBuilder = new EventHandlerMethodsBuilder(this._eventHandlerId);
        return this._methodsBuilder;
    }

    /**
     * Defines the event handler to be unpartitioned. By default it will be partitioned.
     * @returns {EventHandlerBuilder} The builder for continuation.
     */
    unpartitioned(): EventHandlerMethodsBuilder {
        this._partitioned = false;
        this._methodsBuilder = new EventHandlerMethodsBuilder(this._eventHandlerId);
        return this._methodsBuilder;
    }

    /**
     * Defines the event handler to operate on a specific {@link ScopeId}.
     * @param {ScopeId | Guid | string} scopeId - Scope the event handler operates on.
     * @returns {EventHandlerBuilder} The builder for continuation.
     */
    inScope(scopeId: ScopeId | Guid | string): EventHandlerBuilder {
        this._scopeId = ScopeId.from(scopeId);
        return this;
    }

    /**
     * Defines and alias for the event handler.
     * @param {EventHandlerAliasLike} alias - The event handler alias.
     * @returns {EventHandlerBuilder} The builder for continuation.
     */
    withAlias(alias: EventHandlerAliasLike): EventHandlerBuilder {
        this._alias = EventHandlerAlias.from(alias);
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
        const eventHandler = new EventHandler(this._eventHandlerId, this._scopeId, this._partitioned, eventTypeToMethods, this._alias);
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

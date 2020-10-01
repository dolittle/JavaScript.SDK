// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';

import { Constructor } from '@dolittle/types';
import { Guid } from '@dolittle/rudiments';
import { EventType, IEventTypes, EventTypeMap, EventTypeId } from '@dolittle/sdk.artifacts';
import { ScopeId } from '@dolittle/sdk.events';

import { IEventHandler } from './IEventHandler';
import { EventHandler } from './EventHandler';
import { EventHandlerSignature } from './EventHandlerSignature';
import { EventHandlerId } from './EventHandlerId';
import { EventHandlerMethodsBuilder } from './EventHandlerMethodsBuilder';

export type EventHandlerBuilderCallback = (builder: EventHandlerBuilder) => void;

/**
 * Represents a builder for building {@link IEventHandler} - event handlers.
 */
export class EventHandlerBuilder {
    private _methodsBuilder!: EventHandlerMethodsBuilder;
    private _scopeId: ScopeId = ScopeId.default;
    private _partitioned = true;

    /**
     * Initializes a new instance of {@link EventHandlerBuilder}.
     * @param {EventHandlerId} _eventHandlerId The unique identifier of the event handler to build for.
     */
    constructor(private _eventHandlerId: EventHandlerId) {
    }

    /**
     * Gets the {@link ScopeId} the event handler operates on.
     * @returns {ScopeId}
     */
    get scopeId(): ScopeId {
        return this._scopeId;
    }

    /**
     * Gets whether or not the event handler is partitioned.
     * @returns {boolean}
     */
    get isPartitioned(): boolean {
        return this._partitioned;
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
     * @param {Guid | string} scopeId Scope the event handler operates on.
     * @returns {EventHandlerBuilder}
     */
    inScope(scopeId: Guid | string): EventHandlerBuilder {
        this._scopeId = ScopeId.from(scopeId);
        return this;
    }

    /**
     * Builds the {@link IEventHandler}.
     * @param {IEventTypes} eventTypes Event types for resolving event types.
     * @returns {IEventHandler}
     */
    tryBuild(eventTypes: IEventTypes, logger: Logger): [IEventHandler, boolean] {
        const eventTypeToMethods = new EventTypeMap<EventHandlerSignature<any>>();
        if (this._methodsBuilder == null) {
            logger.warning(`Failed to build event handler ${EventHandlerId}. No event handler methods are configured for event handler`);
            return [this.createEventHandler(eventTypeToMethods), false];
        }
        const allMethodsBuilt = this._methodsBuilder.tryAddEventHandlerMethods(eventTypes, eventTypeToMethods, logger);
        return [
            new EventHandler(this._eventHandlerId, this._scopeId, this._partitioned, eventTypeToMethods),
            allMethodsBuilt];
    }

    private createEventHandler(eventTypeToMethods: EventTypeMap<EventHandlerSignature<any>>): IEventHandler {
        return new EventHandler(this._eventHandlerId, this._scopeId, this._partitioned, eventTypeToMethods);
    }

}
interface ICanBuildAnEventHandler {

}

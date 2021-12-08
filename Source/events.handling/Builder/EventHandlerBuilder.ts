// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';
import { Guid } from '@dolittle/rudiments';

import { EventTypeMap, IEventTypes, ScopeId } from '@dolittle/sdk.events';

import { EventHandler, EventHandlerAlias, EventHandlerAliasLike, EventHandlerId, EventHandlerSignature, IEventHandler } from '../';
import { EventHandlerMethodsBuilder } from './EventHandlerMethodsBuilder';
import { IEventHandlerBuilder } from './IEventHandlerBuilder';
import { IEventHandlerMethodsBuilder } from './IEventHandlerMethodsBuilder';

/**
 * Represents an implementation of {@link IEventHandlerBuilder}.
 */
export class EventHandlerBuilder extends IEventHandlerBuilder {
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

    /** @inheritdoc */
    partitioned(): IEventHandlerMethodsBuilder {
        this._partitioned = true;
        this._methodsBuilder = new EventHandlerMethodsBuilder(this._eventHandlerId);
        return this._methodsBuilder;
    }

    /** @inheritdoc */
    unpartitioned(): IEventHandlerMethodsBuilder {
        this._partitioned = false;
        this._methodsBuilder = new EventHandlerMethodsBuilder(this._eventHandlerId);
        return this._methodsBuilder;
    }

    /** @inheritdoc */
    inScope(scopeId: string | ScopeId | Guid): IEventHandlerBuilder {
        this._scopeId = ScopeId.from(scopeId);
        return this;
    }

    /** @inheritdoc */
    withAlias(alias: EventHandlerAliasLike): IEventHandlerBuilder {
        this._alias = EventHandlerAlias.from(alias);
        return this;
    }

    /**
     * Builds the event handler.
     * @param {IEventTypes} eventTypes - For event types resolution.
     * @param {Logger} logger - For logging.
     * @returns {IEventHandler | undefined} The built event handler if successful.
     */
    build(eventTypes: IEventTypes, logger: Logger): IEventHandler | undefined {
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
        return new EventHandler(this._eventHandlerId, this._scopeId, this._partitioned, eventTypeToMethods, this._alias);
    }
}

// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ScopeId } from '@dolittle/sdk.events';
import { EventHandlerDecoratedType, EventHandlerId, EventHandlerIdAlreadyInUse  } from './index';
import { EventHandlerOptions } from './EventHandlerOptions';

/**
 * Handles registering and mappings between @eventHandler decorated classes and their given id and scope.
 */
export class EventHandlerDecoratedTypes {
    private static readonly _eventHandlers = new Map<Function, EventHandlerId>() ;
    private static readonly _scopes  = new Map<Function, ScopeId>();

    /**
     * Registers an EventHandlerId to a specific type.
     * @param {EventHandlerId} eventHandlerId EventHandlerId to register the type with.
     * @param {Function} eventHandlerType Type of the event handler.
     */
    static registerEventHandler(eventHandlerId: EventHandlerId, eventHandlerType: Function, options: EventHandlerOptions) {
        for (const [func, id] of this._eventHandlers) {
            if (id.equals(eventHandlerId)) throw new EventHandlerIdAlreadyInUse(eventHandlerId, eventHandlerType, func);
        }
        if (options.inScope) {
            this._scopes.set(eventHandlerType, options.inScope);
        }
        this._eventHandlers.set(eventHandlerType, eventHandlerId);
    }

    static registerScope(scopeId: ScopeId, eventHandlerType: Function) {
        this._scopes.set(eventHandlerType, scopeId);
    }

    /**
     * Creates an array of EventhandlerDecoratedType's and calls the callback on each one of them.
     * @param callback
     */
    static forEach(callback: (eventHandlerDecoratedType: EventHandlerDecoratedType) => void) {
        const eventHandlerDecoratedTypes: EventHandlerDecoratedType[] = [];
        for (const [func, id] of this._eventHandlers) {
            const scopeId = this._scopes.has(func) ? this._scopes.get(func)! : ScopeId.default;
            eventHandlerDecoratedTypes.push(new EventHandlerDecoratedType(id, scopeId, func));
        }

        for (const eventHandlerDecoratedType of eventHandlerDecoratedTypes) {
            callback(eventHandlerDecoratedType);
        }
    }
}

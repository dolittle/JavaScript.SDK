// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ScopeId } from '@dolittle/sdk.events';
import { EventHandlerDecoratedType, EventHandlerId, EventHandlerIdAlreadyInUse, EventHandlerOptions  } from './index';

/**
 * Handles registering and mappings between @eventHandler decorated classes and their given id and options.
 */
export class EventHandlerDecoratedTypes {
    private static readonly _eventHandlers = new Map<Function, EventHandlerId>() ;
    private static readonly _scopes  = new Map<Function, ScopeId>();
    private static readonly _unpartitioned  = new Map<Function, boolean>();

    /**
     * Registers an @EventHandlerId to a specific type.
     * @param {EventHandlerId} eventHandlerId EventHandlerId to register the type with.
     * @param {Function} eventHandlerType Type of the event handler.
     */
    static registerEventHandler(eventHandlerId: EventHandlerId, eventHandlerType: Function) {
        for (const [func, id] of this._eventHandlers) {
            if (id.equals(eventHandlerId)) throw new EventHandlerIdAlreadyInUse(eventHandlerId, eventHandlerType, func);
        }
        this._eventHandlers.set(eventHandlerType, eventHandlerId);
    }

    /**
     *  Registers @EventHandlerOptions to a specific type.
     * @param options EventHandlerOptions to register the type with.
     * @param eventHandlerType Type of the event handler.
     */
    static registerOptions(options: EventHandlerOptions, eventHandlerType: Function) {
        if (options.inScope) {
            this._scopes.set(eventHandlerType, ScopeId.from(options.inScope));
        }
        if (options.unpartitioned) {
            this._unpartitioned.set(eventHandlerType, true);
        }
    }

    /**
     * Creates an array of EventhandlerDecoratedType's and calls the callback on each one of them.
     * @param callback
     */
    static forEach(callback: (eventHandlerDecoratedType: EventHandlerDecoratedType) => void) {
        const eventHandlerDecoratedTypes: EventHandlerDecoratedType[] = [];
        for (const [func, id] of this._eventHandlers) {
            const scopeId = this._scopes.has(func) ? this._scopes.get(func)! : ScopeId.default;
            const partitioned = !this._unpartitioned.has(func);
            eventHandlerDecoratedTypes.push(new EventHandlerDecoratedType(id, scopeId, partitioned, func));
        }

        for (const eventHandlerDecoratedType of eventHandlerDecoratedTypes) {
            callback(eventHandlerDecoratedType);
        }
    }
}

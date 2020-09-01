// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ReplaySubject } from 'rxjs';
import { ScopeId } from '@dolittle/sdk.events';

import { EventHandlerDecoratedType, EventHandlerId } from './index';

export class EventHandlerDecoratedTypes {
    private static readonly _eventHandlers = new Map<Function, EventHandlerId>();
    private static readonly _scopes  = new Map<Function, ScopeId>();
    private static readonly _unpartitioned  = new Map<Function, boolean>();

    static registerEventHandler(eventHandlerId: EventHandlerId, type: Function) {
        this._eventHandlers.set(type, eventHandlerId);
    }

    static registerScope(scopeId: ScopeId, type: Function) {
        this._scopes.set(type, scopeId);
    }

    static registerUnpartitioned(type: Function) {
        this._unpartitioned.set(type, true);
    }

    static forEach(callback: (eventHandlerDecoratedType: EventHandlerDecoratedType) => void) {
        const eventHandlerDecoratedTypes: EventHandlerDecoratedType[] = [];
        for (const [func, eventHandlerId] of this._eventHandlers) {
            const scopeId = this._scopes.has(func) ? this._scopes.get(func)! : ScopeId.default;
            const partitioned = !this._unpartitioned.has(func);
            eventHandlerDecoratedTypes.push(new EventHandlerDecoratedType(eventHandlerId, scopeId, partitioned, func));
        }

        for (const eventHandlerDecoratedType of eventHandlerDecoratedTypes) {
            callback(eventHandlerDecoratedType);
        }
    }
}

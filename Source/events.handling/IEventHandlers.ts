// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { EventHandlerId } from './EventHandlerId';
import { EventHandlerSignature } from './EventHandlerMethod';

import { EventHandlersClient } from '@dolittle/runtime.contracts/Runtime/Events.Processing/EventHandlers_grpc_pb';
import { IEventHandler } from './IEventHandler';
import { ScopeId } from './ScopeId';

/**
 * Defines the system for event handlers
 */
export interface IEventHandlers {

    /**
     * Register an event handler
     * @param method Type of event handler
     */
    register(eventHandlerId: EventHandlerId, scopeId: ScopeId, partitioned: boolean, eventHandler: IEventHandler): void;
}



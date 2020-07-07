// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { EventHandlerId } from './EventHandlerId';
import { EventHandlerProvider } from './EventHandler';
import { EventHandlerSignature } from './EventHandlerMethod';

import { EventHandlersClient } from '@dolittle/runtime.contracts/Runtime/Events.Processing/EventHandlers_grpc_pb';

/**
 * Defines the system for event handlers
 */
export interface IEventHandlers {

    readonly eventHandlersClient: EventHandlersClient;

    /**
     * Register an event handler
     * @param method Type of event handler
     */
    register(eventHandlerProvider: EventHandlerProvider, eventType: Function, method: EventHandlerSignature, eventHandlerId?: EventHandlerId): void
}



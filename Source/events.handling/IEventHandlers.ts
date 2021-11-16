// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Cancellation } from '@dolittle/sdk.resilience';
import { EventHandlerProcessor } from './Internal';

/**
 * Defines the system for event handlers
 */
export abstract class IEventHandlers {

    /**
     * Register an event handler
     * @param {EventHandlerProcessor} eventHandlerProcessor Event handler processor to register.
     * @param {Cancellation} cancellation Used to close the connection to the Runtime.
     */
    abstract register(eventHandlerProcessor: EventHandlerProcessor, cancellation?: Cancellation): void;
}

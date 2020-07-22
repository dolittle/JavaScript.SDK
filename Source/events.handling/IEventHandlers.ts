// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Cancellation } from '@dolittle/sdk.resilience';

import { IEventHandler } from './IEventHandler';

/**
 * Defines the system for event handlers
 */
export interface IEventHandlers {

    /**
     * Register an event handler
     * @param {IEventHandler} eventHandler EventHandler to register.
     * @param {Cancellation} cancellation Used to close the connection to the Runtime.
     */
    register(eventHandler: IEventHandler, cancellation?: Cancellation): void;
}

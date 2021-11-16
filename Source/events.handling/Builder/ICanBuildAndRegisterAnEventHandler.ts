// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { EventHandlersClient } from '@dolittle/runtime.contracts/Events.Processing/EventHandlers_grpc_pb';
import { IContainer } from '@dolittle/sdk.common';
import { IEventTypes } from '@dolittle/sdk.events';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { Cancellation } from '@dolittle/sdk.resilience';
import { Logger } from 'winston';
import { IEventHandlers } from '..';

/**
 *
 */
export abstract class ICanBuildAndRegisterAnEventHandler {

    /**.
     * Builds and registers an event handler
     *
     * @param {EventHandlersClient} client The event handlers client.
     * @param {IEventHandlers} eventHandlers The event handlers.
     * @param {IContainer} container The IoC container.
     * @param {ExecutionContext} executionContext The execution context.
     * @param {IEventTypes} eventTypes The event types.
     * @param {Logger} logger The logger
     * @param {Cancellation} cancellation The cancellation token.
     */
    abstract buildAndRegister(
        client: EventHandlersClient,
        eventHandlers: IEventHandlers,
        container: IContainer,
        executionContext: ExecutionContext,
        eventTypes: IEventTypes,
        logger: Logger,
        cancellation: Cancellation): void;
}

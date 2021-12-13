// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';
import { delay } from 'rxjs/operators';

import { ITenantServiceProviders } from '@dolittle/sdk.dependencyinversion';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { Cancellation, retryPipe } from '@dolittle/sdk.resilience';

import { EventHandlersClient } from '@dolittle/runtime.contracts/Events.Processing/EventHandlers_grpc_pb';

import { EventHandlerProcessor } from './Internal/EventHandlerProcessor';
import { IEventHandlers } from './IEventHandlers';

/**
 * Represents an implementation of {IEventHandlers}.
 */
export class EventHandlers extends IEventHandlers {

    /**
     * Initializes an instance of {@link EventHandlers}.
     * @param {EventHandlersClient} _client - The event handlers client to use.
     * @param {ExecutionContext} _executionContext - The base execution context of the client.
     * @param {ITenantServiceProviders} _services - For resolving services while handling requests.
     * @param {Logger} _logger - For logging.
     * @param {number} _pingInterval - The ping interval to configure the reverse call client with.
     */
    constructor(
        private readonly _client: EventHandlersClient,
        private readonly _executionContext: ExecutionContext,
        private readonly _services: ITenantServiceProviders,
        private readonly _logger: Logger,
        private readonly _pingInterval: number,
    ) {
        super();
    }

    /** @inheritdoc */
    register(eventHandlerProcessor: EventHandlerProcessor, cancellation = Cancellation.default): void {
        eventHandlerProcessor.registerForeverWithPolicy(
            retryPipe(delay(1000)),
            this._client,
            this._executionContext,
            this._services,
            this._logger,
            this._pingInterval,
            cancellation)
        .subscribe({
            error: (error: Error) => {
                this._logger.error(`Failed to register event handler: ${error}`);
            },
            complete: () => {
                this._logger.error(`Event handler registration completed.`);
            }
        });
    }
}

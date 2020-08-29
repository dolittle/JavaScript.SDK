// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { map, filter, delay } from 'rxjs/operators';
import { Logger } from 'winston';

import { IArtifacts, ArtifactMap } from '@dolittle/sdk.artifacts';
import { IExecutionContextManager } from '@dolittle/sdk.execution';
import { Cancellation, retryPipe } from '@dolittle/sdk.resilience';

import { EventHandlersClient } from '@dolittle/runtime.contracts/Runtime/Events.Processing/EventHandlers_grpc_pb';

import { EventHandler, internal, IEventHandlers, EventHandlerDecoratedTypes, EventHandlerDecoratedType, HandlesDecoratedMethods, EventHandlerSignature, IEventHandler } from './index';
import { ScopeId } from '@dolittle/sdk.events';

/**
 * Represents an implementation of {IEventHandlers}.
 */
export class EventHandlers implements IEventHandlers {

    /**
     * Initializes an instance of {@link EventHandlers}.
     * @param {EventHandlersClient} _eventHandlersClient Client to use for connecting to the runtime.
     * @param {IExecutionContextManager} _executionContextManager For managing execution context.
     * @param {IArtifacts} _artifacts For mapping artifacts.
     * @param {Logger} _logger For logging.
     * @param {Cancellation} _cancellation For handling cancellation.
     */
    constructor(
        private _eventHandlersClient: EventHandlersClient,
        private _executionContextManager: IExecutionContextManager,
        private _artifacts: IArtifacts,
        private _logger: Logger,
        private _cancellation: Cancellation,
    ) {
        this.registerDecoratedEventHandlerTypes();
    }

    /** @inheritdoc */
    register(eventHandler: IEventHandler, cancellation = Cancellation.default): void {
        this._logger.debug(`Registering a ${eventHandler.partitioned ? 'partitioned' : 'unpartitioned'} EventHandler with Id '${eventHandler.eventHandlerId}' for scope '${eventHandler.scopeId}'.`);
        new internal.EventHandlerProcessor(
            eventHandler.eventHandlerId,
            eventHandler.scopeId,
            eventHandler.partitioned,
            eventHandler,
            this._eventHandlersClient,
            this._executionContextManager,
            this._artifacts,
            this._logger)
            .registerForeverWithPolicy(retryPipe(delay(1000)), cancellation).subscribe({
                error: (error: Error) => {
                    this._logger.error(`Failed to register event handler: ${error}`);
                },
                complete: () => {
                    this._logger.error(`Event handler registration completed.`);
                }
            });
    }

    private registerDecoratedEventHandlerTypes() {
        EventHandlerDecoratedTypes.forEach(_ => {
            if (!this.eventHandlerHandlesEvents(_.type)) {
                this._logger.warn(`EventHandler with Id '${_.eventHandlerId}' does not handle any events. This event handler will not be registered.`);
                return;
            }
            this._logger.debug(`Register EventHandler '${_.eventHandlerId}'`);

            const eventHandler = new EventHandler(_.eventHandlerId, _.scopeId, true, this.getEventHandlerMethodsByArtifact(_.type));
            this.register(eventHandler, this._cancellation);
        });
    }

    private eventHandlerHandlesEvents(eventHandler: Function) {
        return HandlesDecoratedMethods.methodsPerEventHandler.has(eventHandler);
    }

    private getEventHandlerMethodsByArtifact(eventHandler: Function) {
        const methodsByArtifact = new ArtifactMap<EventHandlerSignature<any>>();
            for (const method of HandlesDecoratedMethods.methodsPerEventHandler.get(eventHandler)!) {
                const artifact = this._artifacts.getFor(method.eventType);
                methodsByArtifact.set(artifact, method.method);
            }
        return methodsByArtifact;
    }
}

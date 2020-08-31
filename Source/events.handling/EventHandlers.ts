// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { map, filter, delay } from 'rxjs/operators';
import { Logger } from 'winston';

import { IArtifacts, ArtifactMap } from '@dolittle/sdk.artifacts';
import { IContainer } from '@dolittle/sdk.common';
import { IExecutionContextManager } from '@dolittle/sdk.execution';
import { Cancellation, retryPipe } from '@dolittle/sdk.resilience';
import { Guid } from '@dolittle/rudiments';

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
     * @param {IContainer} _container The container for creating instances needed.
     * @param {IExecutionContextManager} _executionContextManager For managing execution context.
     * @param {IArtifacts} _artifacts For mapping artifacts.
     * @param {Logger} _logger For logging.
     * @param {Cancellation} _cancellation For handling cancellation.
     */
    constructor(
        private readonly _eventHandlersClient: EventHandlersClient,
        private readonly _container: IContainer,
        private readonly _executionContextManager: IExecutionContextManager,
        private readonly _artifacts: IArtifacts,
        private readonly _logger: Logger,
        private readonly _cancellation: Cancellation,
    ) {
        EventHandlerDecoratedTypes.types.pipe(
            filter((value: EventHandlerDecoratedType) => {
                if (HandlesDecoratedMethods.methodsPerEventHandler.has(value.type)) {
                    return true;
                } else {
                    _logger.warn(`EventHandler with Id '${value.eventHandlerId}' does not handle any events. This event handler will not be registered.`);
                    return false;
                }
            }),
            map((value: EventHandlerDecoratedType) => {
                const methodsByArtifact = new ArtifactMap<EventHandlerSignature<any>>();
                for (const method of HandlesDecoratedMethods.methodsPerEventHandler.get(value.type)!) {
                    const artifact = _artifacts.getFor(method.eventType);
                    methodsByArtifact.set(artifact, (event, eventContext) => {

                        if (method.owner) {
                            let instance: any;
                            try {
                                instance = this._container.get(method.owner);
                            } catch (ex) {
                                this._logger.error('Unable to create instance of event handler.', ex);
                                return new Promise<void>(() => { });
                            }

                            const result = method.method.call(instance, event, eventContext);
                            return result;
                        }
                        return method.method(event, eventContext);
                    });
                }
                return new EventHandler(value.eventHandlerId, value.scopeId || ScopeId.default, true, methodsByArtifact);
            })
        ).subscribe({
            next: (eventHandler: IEventHandler) => {
                this.register(eventHandler, _cancellation);
            }
        });
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
}

// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { map, filter, delay } from 'rxjs/operators';
import { Logger } from 'winston';

import { IArtifacts, ArtifactMap } from '@dolittle/sdk.artifacts';
import { IExecutionContextManager } from '@dolittle/sdk.execution';
import { Cancellation, retryPipe } from '@dolittle/sdk.resilience';
import { Guid } from '@dolittle/rudiments';

import { EventHandlersClient } from '@dolittle/runtime.contracts/Runtime/Events.Processing/EventHandlers_grpc_pb';

import { EventHandler } from './EventHandler';
import { EventHandlerDecoratedType } from './EventHandlerDecoratedType';
import { EventHandlerDecoratedTypes } from './EventHandlerDecoratedTypes';
import { EventHandlerSignature } from './EventHandlerSignature';
import { HandlesDecoratedMethods } from './HandlesDecoratedMethods';
import { IEventHandler } from './IEventHandler';
import { IEventHandlers } from './IEventHandlers';
import { EventHandlerProcessor } from './Internal/EventHandlerProcessor';

/**
 * Represents an implementation of {IEventHandlers}.
 */
export class EventHandlers implements IEventHandlers {

    constructor(
        private _eventHandlersClient: EventHandlersClient,
        private _executionContextManager: IExecutionContextManager,
        private _artifacts: IArtifacts,
        private _logger: Logger,
        private _cancellation: Cancellation,
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
                _logger.debug(`Register EventHandler '${value.eventHandlerId}'`);

                const methodsByArtifact = new ArtifactMap<EventHandlerSignature<any>>();
                for (const method of HandlesDecoratedMethods.methodsPerEventHandler.get(value.type)!) {
                    const artifact = _artifacts.getFor(method.eventType);
                    methodsByArtifact.set(artifact, method.method);
                }
                return new EventHandler(value.eventHandlerId, value.scopeId || Guid.empty, true, methodsByArtifact);
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
        new EventHandlerProcessor(
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
                    this._logger.error(`Failed to register eventhandler: ${error}`);
                },
                complete: () => {
                    this._logger.error(`Eventhandler registartion completed.`);
                }
            });
    }
}

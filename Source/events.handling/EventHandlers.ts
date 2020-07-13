// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { forkJoin } from 'rxjs';
import { map, filter } from 'rxjs/operators';

// import { EventDecoratedMethods } from '@dolittle/sdk.events';
import { IEventHandlers } from './IEventHandlers';
import { EventHandlerId } from './EventHandlerId';
import { EventHandlerSignature } from './EventHandlerSignature';
import { EventHandler } from './EventHandler';
import { EventHandlerDecoratedTypes } from './EventHandlerDecoratedTypes';
import { EventHandlerDecoratedType } from './EventHandlerDecoratedType';
import { HandlesDecoratedMethod } from './HandlesDecoratedMethod';
import { HandlesDecoratedMethods } from './HandlesDecoratedMethods';

import { EventHandlersClient } from '@dolittle/runtime.contracts/Runtime/Events.Processing/EventHandlers_grpc_pb';
import { IEventHandler } from './IEventHandler';
import { ScopeId } from './ScopeId';
import { EventHandlerProcessor } from './Internal/EventHandlerProcessor';
import { IExecutionContextManager } from '@dolittle/sdk.execution';
import { IArtifacts, ArtifactMap } from '@dolittle/sdk.artifacts';
import { Logger } from 'winston';
import { Cancellation } from '@dolittle/sdk.services';
import { Guid } from '@dolittle/rudiments';

/**
 * Represents an implementation of {IEventHandlers}.
 */
export class EventHandlers implements IEventHandlers {

    constructor(
        private _eventHandlersClient: EventHandlersClient,
        private _executionContextManager: IExecutionContextManager,
        private _artifacts: IArtifacts,
        private _logger: Logger,
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
                return new EventHandler(value.eventHandlerId, Guid.empty, true, methodsByArtifact);
            })
        ).subscribe({
            next: (eventHandler: IEventHandler) => {
                this.register(eventHandler);
            }
        });
    }

    /** @inheritdoc */
    register(eventHandler: IEventHandler): void {
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
            .register(Cancellation.default).subscribe({
                error: (error: Error) => {
                    console.log('Failed to register eventhandler', error);
                },
                complete: () => {
                    console.log('EventHandler registration completed!');
                }
            });
    }
}

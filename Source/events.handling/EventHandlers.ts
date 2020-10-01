// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Subject, Observable } from 'rxjs';
import { map, filter, delay, groupBy, first, skip } from 'rxjs/operators';
import { Logger } from 'winston';

import { IEventTypes, EventTypeMap } from '@dolittle/sdk.artifacts';
import { IContainer } from '@dolittle/sdk.common';
import { Cancellation, retryPipe } from '@dolittle/sdk.resilience';

import { EventHandlersClient } from '@dolittle/runtime.contracts/Runtime/Events.Processing/EventHandlers_grpc_pb';

import { EventHandler } from './EventHandler';
import { IEventHandlers } from './IEventHandlers';
import { EventHandlerDecoratedTypes } from './EventHandlerDecoratedTypes';
import { EventHandlerDecoratedType } from './EventHandlerDecoratedType';
import { HandlesDecoratedMethods } from './HandlesDecoratedMethods';
import { EventHandlerSignature } from './EventHandlerSignature';
import { IEventHandler } from './IEventHandler';
import { ScopeId } from '@dolittle/sdk.events';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { EventHandlerProcessor } from './Internal';

class EventHandlerRegistration {
    constructor(
        readonly eventHandler: IEventHandler,
        readonly cancellation: Cancellation,
        readonly decoratedType?: Function) {
    }
}

/**
 * Represents an implementation of {IEventHandlers}.
 */
export class EventHandlers implements IEventHandlers {

    /**
     * Initializes an instance of {@link EventHandlers}.
     * @param {Logger} _logger For logging.
     */
    constructor(private readonly _logger: Logger) {
        this.registerEventHandlers();
        this.registerDecoratedEventHandlerTypes();
    }

    /** @inheritdoc */
    register(eventHandlerProcessor: EventHandlerProcessor, cancellation = Cancellation.default): void {
        eventHandlerProcessor.registerForeverWithPolicy(retryPipe(delay(1000)), cancellation).subscribe({
            error: (error: Error) => {
                this._logger.error(`Failed to register event handler: ${error}`);
            },
            complete: () => {
                this._logger.error(`Event handler registration completed.`);
            }
        });
    }

    private registerDecoratedEventHandlerTypes() {
        EventHandlerDecoratedTypes.types.pipe(
            filter((value: EventHandlerDecoratedType) => {
                if (HandlesDecoratedMethods.methodsPerEventHandler.has(value.type)) {
                    return true;
                } else {
                    this._logger.warn(`EventHandler with Id '${value.eventHandlerId}' does not handle any events. This event handler will not be registered.`);
                    return false;
                }
            }),
            map((value: EventHandlerDecoratedType) => {
                const methodsByArtifact = new EventTypeMap<EventHandlerSignature<any>>();
                for (const method of HandlesDecoratedMethods.methodsPerEventHandler.get(value.type)!) {
                    const artifact = this._eventTypes.getFor(method.eventType);
                    methodsByArtifact.set(artifact, (event, eventContext) => {
                        if (method.owner) {
                            let instance: any;
                            try {
                                instance = this._container.get(method.owner);
                            } catch (ex) {
                                this._logger.error('Unable to create instance of event handler.', ex);
                                throw ex;
                            }
                            return method.method.call(instance, event, eventContext);
                        }
                        return method.method(event, eventContext);
                    });
                }
                const eventHandler = new EventHandler(value.eventHandlerId, value.scopeId || ScopeId.default, true, methodsByArtifact);
                return new EventHandlerRegistration(eventHandler, this._cancellation, value.type);
            })
        ).subscribe(this._eventHandlers);
    }

    private registerEventHandlers() {
        this._eventHandlers.pipe(
            groupBy((value: EventHandlerRegistration) => {
                return value.eventHandler.eventHandlerId.toString();
            })
        ).subscribe({
            next: (eventHandlersById: Observable<EventHandlerRegistration>) => {
                eventHandlersById.pipe(
                    first()
                ).subscribe({
                    next: (registration: EventHandlerRegistration) => {
                        const eventHandler = registration.eventHandler;
                        const eventProcessor = new internal.EventHandlerProcessor(
                            eventHandler.eventHandlerId,
                            eventHandler.scopeId,
                            eventHandler.partitioned,
                            eventHandler,
                            this._eventHandlersClient,
                            this._executionContext,
                            this._eventTypes,
                            this._logger);
                        this._logger.debug(`Registering a ${eventHandler.partitioned ? 'partitioned' : 'unpartitioned'} EventHandler with Id '${eventHandler.eventHandlerId}' for scope '${eventHandler.scopeId}'.`);
                        eventProcessor.registerForeverWithPolicy(retryPipe(delay(1000)), registration.cancellation).subscribe({
                            error: (error: Error) => {
                                this._logger.error(`Failed to register event handler: ${error}`);
                            },
                            complete: () => {
                                this._logger.debug(`Event handler registration completed.`);
                            }
                        });
                    }
                });
                eventHandlersById.pipe(
                    skip(1)
                ).subscribe({
                    next: (registration: EventHandlerRegistration) => {
                        if (registration.decoratedType) {
                            this._logger.error(`EventHandlerId '${registration.eventHandler.eventHandlerId}' is already used. The event handler ${registration.decoratedType.name} will not be registered.`);
                        } else {
                            this._logger.error(`EventHandlerId '${registration.eventHandler.eventHandlerId}' is already used. The event handler will not be registered.`);
                        }
                    }
                });
            }
        });
    }
}

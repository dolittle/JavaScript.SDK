// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';

import { Guid } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

import { IContainer } from '@dolittle/sdk.common';
import { EventTypeMap } from '@dolittle/sdk.events';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { Cancellation } from '@dolittle/sdk.resilience';

import { EventHandlersClient } from '@dolittle/runtime.contracts/Runtime/Events.Processing/EventHandlers_grpc_pb';

import { EventHandler, EventHandlerSignature, IEventHandlers, internal } from '../index';
import { EventHandlerDecoratedTypes } from './EventHandlerDecoratedTypes';
import { eventHandler as eventHandlerDecorator } from './eventHandlerDecorator';
import { handles as handlesDecorator } from './handlesDecorator';
import { HandlesDecoratedMethods } from './HandlesDecoratedMethods';
import { EventType, EventTypeId, Generation, IEventTypes } from '@dolittle/sdk.artifacts';
import { HandlesDecoratedMethod } from './HandlesDecoratedMethod';
import { ICanBuildAndRegisterAnEventHandler } from './ICanBuildAndRegisterAnEventHandler';

export class EventHandlerClassBuilder<T> implements ICanBuildAndRegisterAnEventHandler {
    constructor(private readonly _eventHandlerType: Constructor<T>, private readonly _instance?: T) {
    }

    /** @inheritdoc */
    buildAndRegister(
        client: EventHandlersClient,
        eventHandlers: IEventHandlers,
        container: IContainer,
        executionContext: ExecutionContext,
        eventTypes: IEventTypes,
        logger: Logger,
        cancellation: Cancellation): void {

        logger.debug(`Building event handler of type ${this._eventHandlerType.name}`);
        const decoratedType = EventHandlerDecoratedTypes.types.find(_ => _.type === this._eventHandlerType);
        if (decoratedType == null) {
            logger.warning(`The event handler class ${this._eventHandlerType.name} needs to be decorated with an @${eventHandlerDecorator.name} decorator`);
            return;
        }
        logger.debug(`Building ${decoratedType.partitioned ? 'partitioned' : 'unpartitioned'} event handler ${decoratedType.eventHandlerId} processing events in scope ${decoratedType.scopeId} from type ${this._eventHandlerType.name}`);
        const methods = HandlesDecoratedMethods.methodsPerEventHandler.get(this._eventHandlerType);
        if (methods == null) {
            logger.warning(`There are no event handler methods to register in event handler ${this._eventHandlerType.name}. An event handler method needs to be decorated with @${handlesDecorator.name} or have the name {MethodName}`);
            return;
        }
        const eventTypesToMethods = new EventTypeMap<EventHandlerSignature<any>>();
        if (!this.tryAddAllEventHandlerMethods(eventTypesToMethods, methods, eventTypes, container, logger)) {
            return;
        }
        const eventHandler = new EventHandler(decoratedType.eventHandlerId, decoratedType.scopeId, decoratedType.partitioned, eventTypesToMethods);
        eventHandlers.register(
            new internal.EventHandlerProcessor(
                eventHandler,
                client,
                executionContext,
                eventTypes,
                logger), cancellation);
    }

    private tryAddAllEventHandlerMethods(eventTypesToMethods: EventTypeMap<EventHandlerSignature<any>>, methods: HandlesDecoratedMethod[], eventTypes: IEventTypes, container: IContainer, logger: Logger): boolean {
        let allMethodsValid = true;
        for (const method of methods) {
            let eventType: EventType;
            if (method.eventTypeOrId instanceof Guid || typeof method.eventTypeOrId === 'string') {
                eventType = new EventType(
                    EventTypeId.from(method.eventTypeOrId),
                    method.generation != null ? Generation.from(method.generation) : undefined);
            } else if (!eventTypes.hasFor(method.eventTypeOrId)){
                allMethodsValid = false;
                logger.warning(`Could not create event handler method in event handler ${this._eventHandlerType.name} because it handles an event of type ${method.eventTypeOrId.name} which is not associated to an event type`);
                continue;
            } else {
                eventType = eventTypes.getFor(method.eventTypeOrId);
            }
            const eventHandlerMethod = this.tryCreateEventHandlerMethod(method, container, logger);
            if (eventHandlerMethod == null) {
                allMethodsValid = false;
                continue;
            }
            if (eventTypesToMethods.has(eventType)) {
                allMethodsValid = false;
                logger.warning(`Event handler ${this._eventHandlerType.name} has multiple event handler methods handling event type ${eventType}`);
                continue;
            }
            eventTypesToMethods.set(eventType, eventHandlerMethod);
        }
        return allMethodsValid;
    }
    private tryCreateEventHandlerMethod(method: HandlesDecoratedMethod, container: IContainer, logger: Logger): EventHandlerSignature<any> | undefined {
        if (method.owner) {
            let instance = this._instance;
            if (instance == null) {
                try {
                    instance = container.get(method.owner);
                } catch (ex) {
                    logger.warning(`Could not create event handler method in event handler ${this._eventHandlerType.name} because event handler could not be instantiated`);
                    return undefined;
                }
            }
            return (event, eventContext) => method.method.call(instance, event, eventContext);
        }
        return (event, eventContext) => method.method(event, eventContext);
    }
}
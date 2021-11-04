// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { EventHandlersClient } from '@dolittle/runtime.contracts/Events.Processing/EventHandlers_grpc_pb';
import { Generation } from '@dolittle/sdk.artifacts';
import { IContainer } from '@dolittle/sdk.common';
import { EventType, EventTypeId, EventTypeMap, IEventTypes } from '@dolittle/sdk.events';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { Cancellation } from '@dolittle/sdk.resilience';
import { Constructor } from '@dolittle/types';
import { Logger } from 'winston';
import { EventHandler, EventHandlerAlias, EventHandlerSignature, IEventHandlers } from '..';
import { EventHandlerProcessor } from '../Internal';
import { CannotRegisterEventHandlerThatIsNotAClass } from './CannotRegisterEventHandlerThatIsNotAClass';
import { CouldNotCreateInstanceOfEventHandler } from './CouldNotCreateInstanceOfEventHandler';
import { EventHandlerDecoratedTypes } from './EventHandlerDecoratedTypes';
import { eventHandler as eventHandlerDecorator } from './eventHandlerDecorator';
import { HandlesDecoratedMethod } from './HandlesDecoratedMethod';
import { HandlesDecoratedMethods } from './HandlesDecoratedMethods';
import { handles as handlesDecorator } from './handlesDecorator';
import { ICanBuildAndRegisterAnEventHandler } from './ICanBuildAndRegisterAnEventHandler';


export class EventHandlerClassBuilder<T> extends ICanBuildAndRegisterAnEventHandler {
    private readonly _eventHandlerType: Constructor<T>;
    private readonly _getInstance: (container: IContainer, executionContext: ExecutionContext) => T;

    constructor(typeOrInstance: Constructor<T> | T) {
        super();
        if (typeOrInstance instanceof Function) {
            this._eventHandlerType = typeOrInstance;
            this._getInstance = (container, executionContext) => container.get(typeOrInstance, executionContext);

        } else {
            this._eventHandlerType = Object.getPrototypeOf(typeOrInstance).constructor;
            if (this._eventHandlerType === undefined) {
                throw new CannotRegisterEventHandlerThatIsNotAClass(typeOrInstance);
            }
            this._getInstance = () => typeOrInstance;
        }
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
        if (decoratedType === undefined) {
            logger.warn(`The event handler class ${this._eventHandlerType.name} must be decorated with an @${eventHandlerDecorator.name} decorator`);
            return;
        }
        logger.debug(`Building ${decoratedType.partitioned ? 'partitioned' : 'unpartitioned'} event handler ${decoratedType.eventHandlerId} processing events in scope ${decoratedType.scopeId} from type ${this._eventHandlerType.name}`);
        const methods = HandlesDecoratedMethods.methodsPerEventHandler.get(this._eventHandlerType);
        if (methods === undefined) {
            logger.warn(`There are no event handler methods to register in event handler ${this._eventHandlerType.name}. An event handler must to be decorated with @${handlesDecorator.name}`);
            return;
        }
        const eventTypesToMethods = new EventTypeMap<EventHandlerSignature<any>>();
        if (!this.tryAddAllEventHandlerMethods(eventTypesToMethods, methods, eventTypes, container, logger)) {
            logger.warn(`Could not create event handler ${this._eventHandlerType.name} because it contains invalid event handler methods`);
            return;
        }
        const eventHandler = new EventHandler(decoratedType.eventHandlerId, decoratedType.scopeId, decoratedType.partitioned, eventTypesToMethods, decoratedType.alias);
        eventHandlers.register(
            new EventHandlerProcessor(
                eventHandler,
                client,
                executionContext,
                eventTypes,
                logger), cancellation);
    }

    private tryAddAllEventHandlerMethods(eventTypesToMethods: EventTypeMap<EventHandlerSignature<any>>, methods: HandlesDecoratedMethod[], eventTypes: IEventTypes, container: IContainer, logger: Logger): boolean {
        let allMethodsValid = true;
        for (const method of methods) {
            const [hasEventType, eventType] = this.tryGetEventTypeFromMethod(method, eventTypes);

            if (!hasEventType) {
                allMethodsValid = false;
                logger.warn(`Could not create event handler method ${method.name} in event handler ${this._eventHandlerType.name} because it is not associated to an event type`);
                continue;
            }

            const eventHandlerMethod = this.createEventHandlerMethod(method, container);

            if (eventTypesToMethods.has(eventType!)) {
                allMethodsValid = false;
                logger.warn(`Event handler ${this._eventHandlerType.name} has multiple event handler methods handling event type ${eventType}`);
                continue;
            }
            eventTypesToMethods.set(eventType!, eventHandlerMethod);
        }
        return allMethodsValid;
    }

    private createEventHandlerMethod(method: HandlesDecoratedMethod, container: IContainer): EventHandlerSignature<any> {
        return (event, eventContext) => {
            let instance: T;
            try {
                instance = this._getInstance(container, eventContext.executionContext);
            } catch (error) {
                throw new CouldNotCreateInstanceOfEventHandler(this._eventHandlerType, error);
            }
            return method.method.call(instance, event, eventContext);
        };
    }

    private tryGetEventTypeFromMethod(method: HandlesDecoratedMethod, eventTypes: IEventTypes): [boolean, EventType | undefined] {
        if (this.eventTypeIsId(method.eventTypeOrId)) {
            return [
                true,
                new EventType(
                    EventTypeId.from(method.eventTypeOrId),
                    method.generation ? Generation.from(method.generation) : Generation.first)
            ];
        } else if (!eventTypes.hasFor(method.eventTypeOrId)) {
            return [false, undefined];
        } else {
            return [true, eventTypes.getFor(method.eventTypeOrId)];
        }
    }

    private eventTypeIsId(eventTypeOrId: Constructor<any> | EventTypeId | Guid | string): eventTypeOrId is EventTypeId | Guid | string {
        return eventTypeOrId instanceof EventTypeId || eventTypeOrId instanceof Guid || typeof eventTypeOrId === 'string';
    }
}

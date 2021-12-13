// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

import { Generation } from '@dolittle/sdk.artifacts';
import { IServiceProviderBuilder, IClientBuildResults, DependencyInversion } from '@dolittle/sdk.common';
import { EventType, EventTypeId, EventTypeMap, IEventTypes } from '@dolittle/sdk.events';

import { EventHandler } from '../EventHandler';
import { EventHandlerSignature } from '../EventHandlerSignature';
import { IEventHandler } from '../IEventHandler';
import { CannotRegisterEventHandlerThatIsNotAClass } from './CannotRegisterEventHandlerThatIsNotAClass';
import { CouldNotCreateInstanceOfEventHandler } from './CouldNotCreateInstanceOfEventHandler';
import { eventHandler as eventHandlerDecorator, getEventHandlerDecoratedType } from './eventHandlerDecorator';
import { HandlesDecoratedMethod } from './HandlesDecoratedMethod';
import { HandlesDecoratedMethods } from './HandlesDecoratedMethods';
import { handles as handlesDecorator } from './handlesDecorator';

/**
 * Represents a builder for building event handlers from classes.
 * @template T The event handler class type.
 */
export class EventHandlerClassBuilder<T> {
    private readonly _eventHandlerType: Constructor<T>;
    private readonly _bindingCallback: DependencyInversion.TenantServiceBindingCallback;

    /**
     * Initialises a new instance of the {@link FailureReason} class.
     * @param {Constructor<T> | T} typeOrInstance - The type or an instance of the event handler.
     */
    constructor(typeOrInstance: Constructor<T> | T) {
        if (typeOrInstance instanceof Function) {
            this._eventHandlerType = typeOrInstance;
            this._bindingCallback = (binder) => binder.bind(this._eventHandlerType).toType(this._eventHandlerType);

        } else {
            this._eventHandlerType = Object.getPrototypeOf(typeOrInstance).constructor;
            if (this._eventHandlerType === undefined) {
                throw new CannotRegisterEventHandlerThatIsNotAClass(typeOrInstance);
            }
            this._bindingCallback = (binder) => binder.bind(this._eventHandlerType).toInstance(typeOrInstance);
        }
    }

    /**
     * Builds the event handler.
     * @param {IEventTypes} eventTypes - For event types resolution.
     * @param {IServiceProviderBuilder} bindings - For registering the bindings for the event handler class.
     * @param {IClientBuildResults} results - For keeping track of build results.
     * @returns {IEventHandler | undefined} The built event handler if successful.
     */
    build(eventTypes: IEventTypes, bindings: IServiceProviderBuilder, results: IClientBuildResults): IEventHandler | undefined {
        results.addInformation(`Building event handler of type ${this._eventHandlerType.name}`);
        const decoratedType = getEventHandlerDecoratedType(this._eventHandlerType);
        if (decoratedType === undefined) {
            results.addFailure(`The event handler class ${this._eventHandlerType.name} must be decorated with an @${eventHandlerDecorator.name} decorator`);
            return;
        }

        bindings.addTenantServices(this._bindingCallback);

        results.addInformation(`Building ${decoratedType.partitioned ? 'partitioned' : 'unpartitioned'} event handler ${decoratedType.eventHandlerId} processing events in scope ${decoratedType.scopeId} from type ${this._eventHandlerType.name}`);
        const methods = HandlesDecoratedMethods.methodsPerEventHandler.get(this._eventHandlerType);
        if (methods === undefined) {
            results.addFailure(`There are no event handler methods to register in event handler ${this._eventHandlerType.name}. An event handler must to be decorated with @${handlesDecorator.name}`);
            return;
        }

        const eventTypesToMethods = new EventTypeMap<EventHandlerSignature<any>>();
        if (!this.tryAddAllEventHandlerMethods(eventTypesToMethods, methods, eventTypes, results)) {
            results.addFailure(`Could not create event handler ${this._eventHandlerType.name} because it contains invalid event handler methods`);
            return;
        }
        return new EventHandler(decoratedType.eventHandlerId, decoratedType.scopeId, decoratedType.partitioned, eventTypesToMethods, decoratedType.alias);
    }

    private tryAddAllEventHandlerMethods(eventTypesToMethods: EventTypeMap<EventHandlerSignature<any>>, methods: HandlesDecoratedMethod[], eventTypes: IEventTypes, results: IClientBuildResults): boolean {
        let allMethodsValid = true;
        for (const method of methods) {
            const [hasEventType, eventType] = this.tryGetEventTypeFromMethod(method, eventTypes);

            if (!hasEventType) {
                allMethodsValid = false;
                results.addFailure(`Could not create event handler method ${method.name} in event handler ${this._eventHandlerType.name} because it is not associated to an event type`);
                continue;
            }

            const eventHandlerMethod = this.createEventHandlerMethod(method);

            if (eventTypesToMethods.has(eventType!)) {
                allMethodsValid = false;
                results.addFailure(`Event handler ${this._eventHandlerType.name} has multiple event handler methods handling event type ${eventType}`);
                continue;
            }
            eventTypesToMethods.set(eventType!, eventHandlerMethod);
        }
        return allMethodsValid;
    }

    private createEventHandlerMethod(method: HandlesDecoratedMethod): EventHandlerSignature<any> {
        return async (event, eventContext, services, logger) => {
            try {
                const instance = await services.getAsync(this._eventHandlerType);
                return method.method.call(instance, event, eventContext, services, logger);
            } catch (error) {
                throw new CouldNotCreateInstanceOfEventHandler(this._eventHandlerType, error);
            }
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

    private eventTypeIsId(eventTypeOrId: Constructor<any> | EventTypeId | Guid | string): eventTypeOrId is EventTypeId | Guid | string {
        return eventTypeOrId instanceof EventTypeId || eventTypeOrId instanceof Guid || typeof eventTypeOrId === 'string';
    }
}

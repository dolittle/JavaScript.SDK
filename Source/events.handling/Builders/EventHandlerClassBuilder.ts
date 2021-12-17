// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

import { Generation } from '@dolittle/sdk.artifacts';
import { IClientBuildResults } from '@dolittle/sdk.common';
import { IServiceProviderBuilder, TenantServiceBindingCallback } from '@dolittle/sdk.dependencyinversion';
import { EventType, EventTypeId, EventTypeIdLike, EventTypeMap, IEventTypes } from '@dolittle/sdk.events';

import { EventHandler } from '../EventHandler';
import { EventHandlerDecoratedType } from './EventHandlerDecoratedType';
import { EventHandlerSignature } from '../EventHandlerSignature';
import { IEventHandler } from '../IEventHandler';
import { CouldNotCreateInstanceOfEventHandler } from './CouldNotCreateInstanceOfEventHandler';
import { HandlesDecoratedMethod } from './HandlesDecoratedMethod';
import { handles as handlesDecorator, getHandlesDecoratedMethods } from './handlesDecorator';

/**
 * Represents a builder for building an event handler from a class.
 * @template T The event handler class type.
 */
export class EventHandlerClassBuilder<T> {
    private readonly _bindingCallback: TenantServiceBindingCallback;

    /**
     * Initialises a new instance of the {@link EventHandlerClassBuilder} class.
     * @param {EventHandlerDecoratedType} _eventHandlerType - The decorated event handler type of the class.
     * @param {Constructor<T>} type - The class of the event handler.
     * @param {T} [instance] - An optional instance of the class to use when processing.
     */
    constructor(private readonly _eventHandlerType: EventHandlerDecoratedType, readonly type: Constructor<T>, instance?: T) {
        if (instance === undefined) {
            this._bindingCallback = (binder) => binder.bind(type).toType(type);
        } else {
            this._bindingCallback = (binder) => binder.bind(type).toInstance(instance);
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
        results.addInformation(`Building event handler of type ${this.type.name}`);

        bindings.addTenantServices(this._bindingCallback);

        results.addInformation(`Building ${this._eventHandlerType.partitioned ? 'partitioned' : 'unpartitioned'} event handler ${this._eventHandlerType.eventHandlerId} processing events in scope ${this._eventHandlerType.scopeId} from type ${this.type.name}`);
        const methods = getHandlesDecoratedMethods(this.type);
        if (methods.length < 1) {
            results.addFailure(`There are no event handler methods to register in event handler ${this.type.name}. An event handler must to be decorated with @${handlesDecorator.name}`);
            return;
        }

        const eventTypesToMethods = new EventTypeMap<EventHandlerSignature<any>>();
        if (!this.tryAddAllEventHandlerMethods(eventTypesToMethods, methods, eventTypes, results)) {
            results.addFailure(`Could not create event handler ${this.type.name} because it contains invalid event handler methods`);
            return;
        }
        return new EventHandler(this._eventHandlerType.eventHandlerId, this._eventHandlerType.scopeId, this._eventHandlerType.partitioned, eventTypesToMethods, this._eventHandlerType.alias);
    }

    private tryAddAllEventHandlerMethods(eventTypesToMethods: EventTypeMap<EventHandlerSignature<any>>, methods: HandlesDecoratedMethod[], eventTypes: IEventTypes, results: IClientBuildResults): boolean {
        let allMethodsValid = true;
        for (const method of methods) {
            const [hasEventType, eventType] = this.tryGetEventTypeFromMethod(method, eventTypes);

            if (!hasEventType) {
                allMethodsValid = false;
                results.addFailure(`Could not create event handler method ${method.name} in event handler ${this.type.name} because it is not associated to an event type`);
                continue;
            }

            const eventHandlerMethod = this.createEventHandlerMethod(method);

            if (eventTypesToMethods.has(eventType!)) {
                allMethodsValid = false;
                results.addFailure(`Event handler ${this.type.name} has multiple event handler methods handling event type ${eventType}`);
                continue;
            }
            eventTypesToMethods.set(eventType!, eventHandlerMethod);
        }
        return allMethodsValid;
    }

    private createEventHandlerMethod(method: HandlesDecoratedMethod): EventHandlerSignature<any> {
        return async (event, eventContext, services, logger) => {
            try {
                const instance = await services.getAsync(this.type);
                return method.method.call(instance, event, eventContext, services, logger);
            } catch (error) {
                throw new CouldNotCreateInstanceOfEventHandler(this.type, error);
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

    private eventTypeIsId(eventTypeOrId: Constructor<any> | EventTypeIdLike): eventTypeOrId is EventTypeIdLike {
        return eventTypeOrId instanceof EventTypeId || eventTypeOrId instanceof Guid || typeof eventTypeOrId === 'string';
    }
}

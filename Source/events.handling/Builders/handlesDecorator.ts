// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';

import { GenerationLike } from '@dolittle/sdk.artifacts';
import { Decorators } from '@dolittle/sdk.common';
import { EventTypeIdLike } from '@dolittle/sdk.events';

import { EventHandlerSignature } from '../EventHandlerSignature';
import { HandlesDecoratedMethod } from './HandlesDecoratedMethod';

const [decorator, getMetadata] = Decorators.createMetadataDecorator<HandlesDecoratedMethod[]>('event-handler-handles-methods', 'handles', Decorators.DecoratorTarget.Method);

/**
 * Decorator for decorating event handler handle methods.
 * @param {Constructor<TEvent>} type - The type of the event to handle.
 * @returns {Decorators.Decorator} The decorator.
 * @template TEvent The event type to handle.
 */
export function handles<TEvent>(type: Constructor<TEvent>): Decorators.Decorator;
/**
 * Decorator for decorating event handler handle methods.
 * @param {EventTypeIdLike} eventTypeId - The event type id to handle.
 * @param {GenerationLike} [generation] - The optional generation of the event type to handle.
 * @returns {Decorators.Decorator} The decorator.
 */
export function handles(eventTypeId: EventTypeIdLike, generation?: GenerationLike): Decorators.Decorator;
export function handles(typeOrId: Constructor<any> | EventTypeIdLike, generation?: GenerationLike) {
    return decorator((target, type, propertyKey, descriptorOrIndex, handlesDecoratedMethods) => {
        const methods = handlesDecoratedMethods || [];

        const methodName = propertyKey as string;
        const method = (descriptorOrIndex as PropertyDescriptor).value as EventHandlerSignature;

        methods.push(new HandlesDecoratedMethod(type, typeOrId, generation, method, methodName));

        return methods;
    });
}
/**
 * Gets the decorated event handler handles methods of the specified class.
 * @param {Constructor<any>} type - The class to get the decorated event handler handles methods for.
 * @returns {HandlesDecoratedMethod[]} The decorated event handler handles methods.
 */
export function getHandlesDecoratedMethods(type: Constructor<any>): HandlesDecoratedMethod[] {
    return getMetadata(type) || [];
}

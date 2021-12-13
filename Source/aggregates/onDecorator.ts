// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

import { Generation, GenerationLike } from '@dolittle/sdk.artifacts';
import { Decorators } from '@dolittle/sdk.common';
import { EventTypeId, EventTypeIdLike } from '@dolittle/sdk.events';

import { OnDecoratedMethod } from './OnDecoratedMethod';
import { OnMethodSignature } from './OnMethodSignature';

const [decorator, getMetadata] = Decorators.createMetadataDecorator<OnDecoratedMethod[]>('aggregate-root-on-methods', 'on', Decorators.DecoratorTarget.Method);

/**
 * Decorator for decorating aggregate root on methods.
 * @param {Constructor<TEvent>} type - The type of the event to handle.
 * @returns {Decorators.Decorator} The decorator.
 * @template TEvent The event type to handle.
 */
export function on<TEvent>(type: Constructor<TEvent>): Decorators.Decorator;
/**
 * Decorator for decorating aggregate root on methods.
 * @param {EventTypeIdLike} eventTypeId - The event type id to handle.
 * @param {GenerationLike} [generation] - The optional generation of the event type to handle.
 */
export function on(eventTypeId: EventTypeIdLike,  generation?: GenerationLike): Decorators.Decorator;
export function on(typeOrId: Constructor<any> | EventTypeId | Guid | string, generation?: GenerationLike): Decorators.Decorator {
    return decorator((target, type, propertyKey, descriptorOrIndex, onDecoratedMethods) => {
        const methods = onDecoratedMethods || [];

        const methodName = propertyKey as string;
        const method = (descriptorOrIndex as PropertyDescriptor).value as OnMethodSignature;

        methods.push(new OnDecoratedMethod(type, typeOrId, generation ? Generation.from(generation) : undefined, method, methodName));

        return methods;
    });
}

/**
 * Gets the decorated aggregate root on methods of the specified class.
 * @param {Constructor<any>} type - The class to get the decorated aggregate root on methods for.
 * @returns {OnDecoratedMethod[]} The decorated aggregate root on methods.
 */
export function getOnDecoratedMethods(type: Constructor<any>): OnDecoratedMethod[] {
    return getMetadata(type) || [];
}

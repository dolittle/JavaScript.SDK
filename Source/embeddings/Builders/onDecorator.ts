// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';

import { Generation, GenerationLike } from '@dolittle/sdk.artifacts';
import { Decorators } from '@dolittle/sdk.common';
import { EventTypeIdLike } from '@dolittle/sdk.events';

import { EmbeddingClassOnMethod } from './EmbeddingClassOnMethod';
import { OnDecoratedEmbeddingMethod } from './OnDecoratedEmbeddingMethod';

const [decorator, getMetadata] = Decorators.createMetadataDecorator<OnDecoratedEmbeddingMethod[]>('embedding-on-methods', 'on', Decorators.DecoratorTarget.Method);

/**
 * Decorator for decorating embedding on methods.
 * @param {Constructor<TEvent>} type - The type of the event to handle.
 * @returns {Decorators.Decorator} The decorator.
 * @template TEvent The event type to handle.
 */
export function on<TEvent>(type: Constructor<TEvent>): Decorators.Decorator;
/**
 * Decorator for decorating embedding on methods.
 * @param {EventTypeIdLike} eventTypeId - The event type id to handle.
 * @param {GenerationLike} [generation] - The optional generation of the event type to handle.
 * @returns {Decorators.Decorator} The decorator.
 */
export function on(eventTypeId: EventTypeIdLike, generation?: GenerationLike): Decorators.Decorator;
export function on<T>(typeOrId: Constructor<T> | EventTypeIdLike, generation?: GenerationLike) {
    return decorator((target, type, propertyKey, descriptorOrIndex, onDecoratedMethods) => {
        const methods = onDecoratedMethods || [];

        const methodName = propertyKey as string;
        const method = (descriptorOrIndex as PropertyDescriptor).value as EmbeddingClassOnMethod;

        methods.push(new OnDecoratedEmbeddingMethod(type, typeOrId, generation ? Generation.from(generation) : undefined, method, methodName));

        return methods;
    });
}

/**
 * Gets the decorated embedding on methods of the specified class.
 * @param {Constructor<any>} type - The class to get the decorated embedding on methods for.
 * @returns {OnDecoratedEmbeddingMethod[]} The decorated embedding on methods.
 */
export function getOnDecoratedMethods(type: Constructor<any>): OnDecoratedEmbeddingMethod[] {
    return getMetadata(type) || [];
}

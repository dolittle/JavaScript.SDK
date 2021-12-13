// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';

import { Generation, GenerationLike } from '@dolittle/sdk.artifacts';
import { Decorators } from '@dolittle/sdk.common';
import { EventTypeIdLike } from '@dolittle/sdk.events';

import { KeySelectorBuilder } from './KeySelectorBuilder';
import { KeySelectorBuilderCallback } from './KeySelectorBuilderCallback';
import { OnDecoratedProjectionMethod } from './OnDecoratedProjectionMethod';
import { ProjectionClassOnMethod } from './ProjectionClassOnMethod';

const [decorator, getMetadata] = Decorators.createMetadataDecorator<OnDecoratedProjectionMethod[]>('projection-on-methods', 'on', Decorators.DecoratorTarget.Method);

/**
 * Decorator for decorating projection on methods.
 * @param {Constructor<TEvent>} type - The type of the event to handle.
 * @param {KeySelectorBuilderCallback<TEvent>} keySelectorCallback - The callback to build the key selector.
 * @returns {Decorators.Decorator} The decorator.
 * @template TEvent The event type to handle.
 */
export function on<TEvent>(type: Constructor<TEvent>, keySelectorCallback: KeySelectorBuilderCallback<TEvent>): Decorators.Decorator;
/**
 * Decorator for decorating projection on methods.
 * @param {EventTypeIdLike} eventTypeId - The event type id to handle.
 * @param {KeySelectorBuilderCallback} keySelectorCallback - The callback to build the key selector.
 * @returns {Decorators.Decorator} The decorator.
 */
export function on(eventTypeId: EventTypeIdLike, keySelectorCallback: KeySelectorBuilderCallback): Decorators.Decorator;
/**
 * Decorator for decorating projection on methods.
 * @param {EventTypeIdLike} eventTypeId - The event type id to handle.
 * @param {GenerationLike} [generation] - The optional generation of the event type to handle.
 * @param {KeySelectorBuilderCallback} keySelectorCallback - The callback to build the key selector.
 * @returns {Decorators.Decorator} The decorator.
 */
export function on(eventTypeId: EventTypeIdLike, generation: GenerationLike, keySelectorCallback: KeySelectorBuilderCallback): Decorators.Decorator;
export function on(typeOrId: Constructor<any> | EventTypeIdLike, keySelectorCallbackOrGeneration: KeySelectorBuilderCallback | GenerationLike, maybeKeySelectorCallback?: KeySelectorBuilderCallback): Decorators.Decorator {
    return decorator((target, type, propertyKey, descriptorOrIndex, onDecoratedMethods) => {
        const methods = onDecoratedMethods || [];

        const generation = maybeKeySelectorCallback !== undefined ? Generation.from(keySelectorCallbackOrGeneration as GenerationLike) : undefined;
        const keySelectorCallback = maybeKeySelectorCallback !== undefined ? maybeKeySelectorCallback : keySelectorCallbackOrGeneration as KeySelectorBuilderCallback;
        const keySelector = keySelectorCallback(new KeySelectorBuilder());

        const methodName = propertyKey as string;
        const method = (descriptorOrIndex as PropertyDescriptor).value as ProjectionClassOnMethod;

        methods.push(new OnDecoratedProjectionMethod(type, typeOrId, generation, keySelector, method, methodName));

        return methods;
    });
}

/**
 * Gets the decorated projection on methods of the specified class.
 * @param {Constructor<any>} type - The class to get the decorated projection on methods for.
 * @returns {OnDecoratedProjectionMethod[]} The decorated projection on methods.
 */
export function getOnDecoratedMethods(type: Constructor<any>): OnDecoratedProjectionMethod[] {
    return getMetadata(type) || [];
}

// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';

import { Decorators } from '@dolittle/sdk.common';
import { UpdateDecoratedMethod } from './UpdateDecoratedMethod';
import { EmbeddingAlreadyHasAnUpdateDecorator } from './EmbeddingAlreadyHasAnUpdateDecorator';
import { EmbeddingClassUpdateMethod } from './EmbeddingClassUpdateMethod';

const [decorator, getMetadata] = Decorators.createMetadataDecorator<UpdateDecoratedMethod>('embedding-resolve-update-method', 'resolveUpdateToEvents', Decorators.DecoratorTarget.Method);

/**
 * Decorator for decorating the update method of an embedding.
 * @returns {Decorators.Decorator} The decorator.
 */
export function resolveUpdateToEvents(): Decorators.Decorator {
    return decorator((target, type, propertyKey, descriptorOrIndex, updateMethod) => {
        if (updateMethod !== undefined) {
            throw new EmbeddingAlreadyHasAnUpdateDecorator(type, updateMethod.name);
        }

        const methodName = propertyKey as string;
        const method = (descriptorOrIndex as PropertyDescriptor).value as EmbeddingClassUpdateMethod;

        return new UpdateDecoratedMethod(type, method, methodName);
    });
}

/**
 * Gets the decorated embedding update method of the specified class.
 * @param {Constructor<any>} type - The class to get the decorated update embedding method for.
 * @returns {UpdateDecoratedMethod | undefined} The decorated update embedding method.
 */
export function getUpdateDecoratedMethod(type: Constructor<any>): UpdateDecoratedMethod | undefined {
    return getMetadata(type);
}

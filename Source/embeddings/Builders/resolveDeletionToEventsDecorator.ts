// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';

import { Decorators } from '@dolittle/sdk.common';
import { DeletionDecoratedMethod } from './DeletionDecoratedMethod';
import { EmbeddingAlreadyHasADeletionDecorator } from './EmbeddingAlreadyHasADeletionDecorator';
import { EmbeddingClassDeletionMethod } from './EmbeddingClassDeletionMethod';

const [decorator, getMetadata] = Decorators.createMetadataDecorator<DeletionDecoratedMethod>('embedding-resolve-deletion-method', 'resolveDeletionToEvents', Decorators.DecoratorTarget.Method);

/**
 * Decorator for decorating the delete method of an embedding.
 * @returns {Decorators.Decorator} The decorator.
 */
export function resolveDeletionToEvents(): Decorators.Decorator {
    return decorator((target, type, propertyKey, descriptorOrIndex, deleteMethod) => {
        if (deleteMethod !== undefined) {
            throw new EmbeddingAlreadyHasADeletionDecorator(type, deleteMethod.name);
        }

        const methodName = propertyKey as string;
        const method = (descriptorOrIndex as PropertyDescriptor).value as EmbeddingClassDeletionMethod;

        return new DeletionDecoratedMethod(type, method, methodName);
    });
}

/**
 * Gets the decorated embedding delete method of the specified class.
 * @param {Constructor<any>} type - The class to get the decorated delete embedding method for.
 * @returns {DeletionDecoratedMethod | undefined} The decorated delete embedding method.
 */
export function getDeletionDecoratedMethod(type: Constructor<any>): DeletionDecoratedMethod | undefined {
    return getMetadata(type);
}

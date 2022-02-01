// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Decorators } from '@dolittle/sdk.common';
import { Constructor } from '@dolittle/types';
import { CollectionName, CollectionNameLike } from '../../Copies/MongoDB/CollectionName';

import { CopyProjectionToMongoDBDecoratedType } from './CopyProjectionToMongoDBDecoratedType';

const [decorator, getMetadata] = Decorators.createMetadataDecorator<CopyProjectionToMongoDBDecoratedType>('copy-projection-to-mongodb', 'copyProjectionToMongoDB', Decorators.DecoratorTarget.Class);

/**
 * Decorator to mark a Projection class to copy the read models to a MongoDB collection.
 * @param {CollectionNameLike} [collection] - An optional collection name to use, defaults to the name of the class.
 * @returns {Decorators.Decorator} The decorator.
 */
export function copyProjectionToMongoDB(collection?: CollectionNameLike): Decorators.Decorator {
    return decorator((target, type) => {
        return new CopyProjectionToMongoDBDecoratedType(
            CollectionName.from(collection ?? type.name),
            type);
    });
}

/**
 * Checks whether the specified class is decorated with a copy to MongoDB decorator.
 * @param {Constructor<any>} type - The class to get the decorated copy to MongoDB for.
 * @returns {boolean} True if the decorator is applied, false if not.
 */
export function isDecoratedCopyProjectionToMongoDB(type: Constructor<any>): boolean {
    return getMetadata(type, false, false) !== undefined;
}

/**
 * Gets the {@link CopyProjectionToMongoDBDecoratedType} of the specified class.
 * @param {Constructor<any>} type - The class to get the decorated copy to MongoDB for.
 * @returns {CopyProjectionToMongoDBDecoratedType} The decorated projection type.
 */
export function getDecoratedCopyProjectionToMongoDB(type: Constructor<any>): CopyProjectionToMongoDBDecoratedType {
    return getMetadata(type, true, 'Projection classes to be copied to MongoDB must be decorated');
}

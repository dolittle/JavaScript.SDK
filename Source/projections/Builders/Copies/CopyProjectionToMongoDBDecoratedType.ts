// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';

import { CollectionName } from '../../Copies/MongoDB/CollectionName';

/**
 * Represents a projection decorated with the a 'copyToMongoDB' decorator.
 */
export class CopyProjectionToMongoDBDecoratedType {
    /**
     * Initialises a new instance of the {@link CopyProjectionToMongoDBDecoratedType} class.
     * @param {CollectionName} collection - The collection name to use.
     * @param {Constructor<any>} type - The decorated type.
     */
    constructor(
        readonly collection: CollectionName,
        readonly type: Constructor<any>,
    ) {}
}

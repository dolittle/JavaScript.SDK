// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ProjectionField } from '../ProjectionField';
import { CollectionName } from './CollectionName';
import { Conversion } from './Conversion';

/**
 * Represents the specification of MongoDB read model copies to produce for a projection.
 */
export class MongoDBCopies {
    /**
     * Initialises a new instance of the {@link MongoDBCopies} class.
     * @param {boolean} shouldCopyToMongoDB - A value indicating whether or not to produce read model copies to a MongoDB collection.
     * @param {CollectionName} collectionName - The name of the collection to copy read models to.
     * @param {ReadonlyMap<ProjectionField, Conversion>} conversions - The conversions to apply when copying read models.
     */
    constructor(
        readonly shouldCopyToMongoDB: boolean,
        readonly collectionName: CollectionName,
        readonly conversions: ReadonlyMap<ProjectionField, Conversion>,
    ) {}

    /**
     * Gets the default {@link MongoDBCopies} specification, where no read model copies will be produced in MongoDB.
     */
    static get default(): MongoDBCopies {
        return new MongoDBCopies(false, CollectionName.notSet, new Map());
    }
}

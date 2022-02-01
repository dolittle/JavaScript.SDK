// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { CollectionNameLike } from '../Copies/MongoDB/CollectionName';
import { Conversion } from '../Copies/MongoDB/Conversion';
import { ReadModelField } from './ReadModelField';

/**
 * Defines a builder for configuring read model copies to a MongoDB collection.
 * @template T The type of the projection read model.
 */
export abstract class ICopyToMongoDBBuilder<T> {
    /**
     * Configures the collection name to store the read model copies in.
     * @param {CollectionNameLike} collectionName - The collection name.
     * @returns {ICopyToMongoDBBuilder<T>} - The builder for continuation.
     */
    abstract collection(collectionName: CollectionNameLike): ICopyToMongoDBBuilder<T>;

    /**
     * Configures a conversion for a field on the readmodel.
     * @param {ReadModelField<T>} field - The field to convert.
     * @param {Conversion} to - The conversion to apply.
     * @returns {ICopyToMongoDBBuilder<T>} - The builder for continuation.
     */
    abstract convert(field: ReadModelField<T>, to: Conversion): ICopyToMongoDBBuilder<T>;
}

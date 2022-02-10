// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';
import { Collection, CollectionOptions, Db, Document } from 'mongodb';

import { getDecoratedCopyProjectionToMongoDB, isDecoratedCopyProjectionToMongoDB } from '@dolittle/sdk.projections';

declare module 'mongodb' {
    interface Db {
        /**
         * Returns a reference to a MongoDB Collection. If it does not exist it will be created implicitly.
         *
         * @param name - The collection name we wish to access.
         * @returns Return the new Collection instance.
         */
        collection<TSchema extends Document>(type: Constructor<TSchema>, options?: CollectionOptions): Collection<TSchema>;
    }
}

type OriginalCollectionSignature = (name: string, options?: CollectionOptions) => Collection;
const originalCollectionMethod: OriginalCollectionSignature = Db.prototype.collection;

Db.prototype.collection = function<TSchema extends Document>(typeOrName: Constructor<TSchema> | string, options?: CollectionOptions): Collection<TSchema> {
    let collectionName = typeof typeOrName === 'string' ? typeOrName : typeOrName.name;

    if (typeOrName instanceof Function && isDecoratedCopyProjectionToMongoDB(typeOrName)) {
        const decorator = getDecoratedCopyProjectionToMongoDB(typeOrName);
        collectionName = decorator.collection.value;
    }

    return originalCollectionMethod.call(this, collectionName, options) as any;
};

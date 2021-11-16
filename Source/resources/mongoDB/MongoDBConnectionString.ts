// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ConceptAs } from '@dolittle/concepts';

/**
 * Defines types that can be converted into a {@link MongoDBConnectionString}.
 */
export type MongoDBConnectionStringLike = string | MongoDBConnectionString;

/**
 * Represents the MongoDB connection string.
 */
export class MongoDBConnectionString extends ConceptAs<string, '@dolittle/sdk.resources.mongoDB.MongoDBConnectionString'> {
    constructor(connectionString: string) {
        super(connectionString, '@dolittle/sdk.resources.mongoDB.MongoDBConnectionString');
    }
    /**
     * Creates an {@link MongoDBConnectionString} from a string.
     * @param {MongoDBConnectionStringLike} connectionString - The connection string.
     * @returns {MongoDBConnectionString} The connection string concept.
     */
    static from(connectionString: MongoDBConnectionStringLike): MongoDBConnectionString {
        if (connectionString instanceof MongoDBConnectionString) return connectionString;
        return new MongoDBConnectionString(connectionString);
    }
}

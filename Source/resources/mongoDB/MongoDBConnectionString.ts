// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ConceptAs } from '@dolittle/concepts';

export type MongoDBConnectionStringLike = string | MongoDBConnectionString;

/**
 * Represents the MongoDB connection string.
 *
 * @export
 * @class MongoDBConnectionString
 * @extends {ConceptAs<string, '@dolittle/sdk.resources.MongoDBConnectionString'>}
 */
export class MongoDBConnectionString extends ConceptAs<string, '@dolittle/sdk.resources.mongoDB.MongoDBConnectionString'> {
    constructor(connectionString: string) {
        super(connectionString, '@dolittle/sdk.resources.mongoDB.MongoDBConnectionString');
    }
    /**
     * Creates an {@link MongoDBConnectionString} from a string.
     *
     * @static
     * @param {MongoDBConnectionStringLike} name
     * @returns {MongoDBConnectionString}
     */
    static from(name: MongoDBConnectionStringLike): MongoDBConnectionString {
        if (name instanceof MongoDBConnectionString) return name;
        return new MongoDBConnectionString(name);
    }
};

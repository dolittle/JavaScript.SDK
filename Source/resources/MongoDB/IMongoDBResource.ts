// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Db } from 'mongodb';

import { DatabaseSettingsCallback } from './DatabaseSettingsCallback';

/**
 * Defines a MongoDB resource.
 */
export abstract class IMongoDBResource {
    /**
     * Gets the MongoDB database.
     * @returns {Db} The MongoDB database.
     */
    abstract getDatabase(): Db;

    /**
     * Gets the MongoDB database.
     * @param {DatabaseSettingsCallback} databaseSettingsCallback - A callback to use to configure the database settings.
     * @returns {Db} The MongoDB database.
     */
    abstract getDatabase(databaseSettingsCallback: DatabaseSettingsCallback): Db;
}

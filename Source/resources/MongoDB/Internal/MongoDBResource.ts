// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Db, MongoClient, DbOptions } from 'mongodb';

import { IMongoDBResource } from '../IMongoDBResource';
import { DatabaseSettingsCallback } from '../DatabaseSettingsCallback';

/**
 * Represents an implementation of {@link IMongoDBResource}.
 */
export class MongoDBResource extends IMongoDBResource {
    /**
     * Initialises an instance of the {@link MongoDBResource} class.
     * @param {MongoClient} _client - The connected MongoDB client for this resource.
     */
    constructor(private readonly _client: MongoClient) {
        super();
    }

    /** @inheritdoc */
    getDatabase(): Db;
    getDatabase(databaseSettingsCallback: DatabaseSettingsCallback): Db;
    getDatabase(maybeDatabaseSettingsCallback?: DatabaseSettingsCallback): Db {
        const settings = this.getDatabaseSettings(maybeDatabaseSettingsCallback);
        return this.getDatabaseFromClient(this._client, settings);
    }

    private getDatabaseSettings(databaseSettingsCallback?: DatabaseSettingsCallback): DbOptions | undefined {
        if (!databaseSettingsCallback) {
            return undefined;
        }

        const options = {};
        databaseSettingsCallback(options);
        return options;
    }

    private getDatabaseFromClient(client: MongoClient, dbOptions?: DbOptions): Db {
        return client.db(undefined, dbOptions);
    }
}

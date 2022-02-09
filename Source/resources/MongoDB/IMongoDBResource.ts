// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Db } from 'mongodb';

import { Cancellation } from '@dolittle/sdk.resilience';

import { GetMongoDBResponse, GetRequest } from '@dolittle/runtime.contracts/Resources/Resources_pb';

import { Resource } from '../Resource';
import { DatabaseSettingsCallback } from './DatabaseSettingsCallback';

/**
 * Represents an implementation of {@link Resource} for MongoDB.
 */
export abstract class IMongoDBResource extends Resource<GetRequest, GetMongoDBResponse> {
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

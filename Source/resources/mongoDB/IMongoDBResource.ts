// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { GetMongoDbResponse, GetRequest } from '@dolittle/runtime.contracts/Resources/Resources_pb';
import { Cancellation } from '@dolittle/sdk.resilience';
import { Db, DbOptions } from 'mongodb';

import { Resource } from '../index';

/**
 * Represents the callback for configuring {@link DbOptions}.
 */
export type DatabaseSettingsCallback = (settings: DbOptions) => void;

/**
 * Represents an implementation of {@link Resource} for MongoDB.
 */
export abstract class IMongoDBResource extends Resource<GetRequest, GetMongoDbResponse> {
    /**
     * Gets the the MongoDB connection string.
     * @param {DatabaseSettingsCallback} databaseSettingsCallback - The optional {@link DatabaseSettingsCallback}.
     * @param {Cancellation} cancellation - The optional {@link Cancellation}.
     * @returns {Promise<Db>} A {@link Promise} that when resolved returns the {@link Db} MongoDB Database.
     */
    abstract getDatabase(databaseSettingsCallback?: DatabaseSettingsCallback, cancellation?: Cancellation): Promise<Db>;
}

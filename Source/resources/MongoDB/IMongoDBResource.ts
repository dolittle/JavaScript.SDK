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
     * Gets the the MongoDB database.
     * @param {Cancellation} cancellation - The optional {@link Cancellation}.
     * @returns {Promise<Db>} A {@link Promise} that when resolved returns the {@link Db} MongoDB Database.
     */
    abstract getDatabase(cancellation?: Cancellation): Promise<Db>;

    /**
     * Gets the the MongoDB database.
     * @param {DatabaseSettingsCallback} databaseSettingsCallback - The optional {@link DatabaseSettingsCallback}.
     * @param {Cancellation} cancellation - The optional {@link Cancellation}.
     * @returns {Promise<Db>} A {@link Promise} that when resolved returns the {@link Db} MongoDB Database.
     */
    abstract getDatabase(databaseSettingsCallback?: DatabaseSettingsCallback, cancellation?: Cancellation): Promise<Db>;
}

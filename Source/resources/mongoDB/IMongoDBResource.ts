// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { GetMongoDbResponse, GetRequest } from '@dolittle/runtime.contracts/Resources/Resources_pb';
import { Cancellation } from '@dolittle/sdk.resilience';
import { Resource } from '../index';
import { MongoDBConnectionString } from './MongoDBConnectionString';

/**
 * Represents an implementation of {@link Resource} for MongoDB.
 */
export abstract class IMongoDBResource extends Resource<GetRequest, GetMongoDbResponse> {
    /**
     * Gets the the MongoDB connection string.
     * @param {Cancellation} cancellation - The optional {@link Cancellation}.
     * @returns {Promise<MongoDBConnectionString>} A {@link Promise} that when resolved returns the MongoDB connection string.
     */
    abstract getConnectionString(cancellation?: Cancellation): Promise<MongoDBConnectionString>;
}

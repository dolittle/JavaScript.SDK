// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { MongoClient } from 'mongodb';
import { Logger } from 'winston';

import { ExecutionContext } from '@dolittle/sdk.execution';

import { CallRequestContext } from '@dolittle/contracts/Services/CallContext_pb';
import { Failure } from '@dolittle/contracts/Protobuf/Failure_pb';
import { ResourcesClient } from '@dolittle/runtime.contracts/Resources/Resources_grpc_pb';
import { GetMongoDBResponse, GetRequest } from '@dolittle/runtime.contracts/Resources/Resources_pb';

import { ResourceCreator } from '../../Internal/ResourceCreator';
import { ResourceName } from '../../ResourceName';
import { MongoDBResource } from './MongoDBResource';

/**
 * Represents an implementation of {@link ResourceCreator} for MongoDB.
 */
export class MongoDBResourceCreator extends ResourceCreator<MongoDBResource, GetRequest, GetMongoDBResponse> {

    /**
     * Initialises a new instance of the {@link MongoDBResourceCreator} class.
     * @param {ResourcesClient} client - The resources client to make requests to the Runtime with.
     * @param {ExecutionContext} executionContext - The base execution context for the client.
     * @param {Logger} logger - The logger to use for logging.
     */
    constructor(
        client: ResourcesClient,
        executionContext: ExecutionContext,
        logger: Logger,
    ) {
        super(ResourceName.from('MongoDB'), client.getMongoDB, client, executionContext, logger);
    }

    /** @inheritdoc */
    protected createResourceRequest(callContext: CallRequestContext): GetRequest {
        const request = new GetRequest();
        request.setCallcontext(callContext);
        return request;
    }

    /** @inheritdoc */
    protected requestFailed(response: GetMongoDBResponse): [false] | [true, Failure] {
        if (response.hasFailure()) {
            return [true, response.getFailure()!];
        }

        return [false];
    }

    /** @inheritdoc */
    protected async createResourceFrom(response: GetMongoDBResponse): Promise<MongoDBResource> {
        const client = new MongoClient(response.getConnectionstring());
        await client.connect();
        return new MongoDBResource(client);
    }
}

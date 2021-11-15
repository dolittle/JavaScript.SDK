// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ResourcesClient } from '@dolittle/runtime.contracts/Resources/Resources_grpc_pb';
import { GetMongoDbResponse, GetRequest } from '@dolittle/runtime.contracts/Resources/Resources_pb';
import { ExecutionContext, TenantId } from '@dolittle/sdk.execution';
import { UnaryMethod } from '@dolittle/sdk.services';
import { Cancellation } from '@dolittle/sdk.resilience';
import { Logger } from 'winston';
import { IMongoDBResource, MongoDBConnectionString } from '../index';
import { ResourceName } from '../../index';

/**
 * Represents a client for Resources and an implementation of {@link IMongoDBResource}.
 */
export class MongoDBResource extends IMongoDBResource {

    private readonly _method: UnaryMethod<GetRequest, GetMongoDbResponse>;
    /**
     * Initializes an instance of the {@link Tenants} class.
     * @param tenant The tenant id.
     * @param _client The resources client.
     * @param logger The logger.
     */
    constructor(
        tenant: TenantId,
        client: ResourcesClient,
        executionContext: ExecutionContext,
        logger: Logger) {
        super(ResourceName.from('MongoDB'), tenant, client, executionContext, logger);
        this._method = client.getMongoDb;

    }

    /** @inheritdoc */
    getConnectionString(cancellation?: Cancellation): Promise<MongoDBConnectionString> {
        return this.get(this._method, response => MongoDBConnectionString.from(response.getConnectionstring()), cancellation);
    }

    /** @inheritdoc */
    protected getResultFromResponse(response: GetMongoDbResponse): MongoDBConnectionString {
        return MongoDBConnectionString.from(response.getConnectionstring());
    }

    /** @inheritdoc */
    protected createRequest(): GetRequest {
        const request = new GetRequest();
        request.setCallcontext(this.createCallContext());
        return request;
    }
}
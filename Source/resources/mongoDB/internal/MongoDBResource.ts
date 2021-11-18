// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ResourcesClient } from '@dolittle/runtime.contracts/Resources/Resources_grpc_pb';
import { GetMongoDBResponse, GetRequest } from '@dolittle/runtime.contracts/Resources/Resources_pb';
import { ExecutionContext, TenantId } from '@dolittle/sdk.execution';
import { UnaryMethod } from '@dolittle/sdk.services';
import { Cancellation } from '@dolittle/sdk.resilience';
import { Db, MongoClient, DbOptions } from 'mongodb';
import { Logger } from 'winston';

import { IMongoDBResource, DatabaseSettingsCallback } from '../index';
import { ResourceName } from '../../index';

/**
 * Represents a client for Resources and an implementation of {@link IMongoDBResource}.
 */
export class MongoDBResource extends IMongoDBResource {

    private readonly _openClients: Map<string, MongoClient> = new Map();
    private readonly _method: UnaryMethod<GetRequest, GetMongoDBResponse>;
    /**
     * Initializes an instance of the {@link Tenants} class.
     * @param {TenantId} tenant - The tenant id.
     * @param {ResourcesClient} client - The resources client.
     * @param {ExecutionContext} executionContext - The execution context of the client.
     * @param {Logger} logger - The logger.
     */
    constructor(
        tenant: TenantId,
        client: ResourcesClient,
        executionContext: ExecutionContext,
        logger: Logger) {
        super(ResourceName.from('MongoDB'), tenant, client, executionContext, logger);
        this._method = client.getMongoDB;
    }

    /** @inheritdoc */
    async getDatabase(databaseSettingsCallback?: DatabaseSettingsCallback, cancellation?: Cancellation): Promise<Db> {
        if (!this._openClients.has(this.tenant.toString())) {
            const connectionString = await this.get(this._method, response => response.getConnectionstring(), cancellation);
            this._openClients.set(this.tenant.toString(), await MongoClient.connect(connectionString));
        }
        return this.getDatabaseFromClient(
            this._openClients.get(this.tenant.toString())!,
            this.getDatabaseSettings(databaseSettingsCallback));
    }

    /** @inheritdoc */
    protected createRequest(): GetRequest {
        const request = new GetRequest();
        request.setCallcontext(this.createCallContext());
        return request;
    }

    private getDatabaseSettings(databaseSettingsCallback?: DatabaseSettingsCallback): DbOptions | undefined {
        let dbOptions;
        if (databaseSettingsCallback) {
            dbOptions = {};
            databaseSettingsCallback(dbOptions);
        }
        return dbOptions;
    }

    private getDatabaseFromClient(client: MongoClient, dbOptions?: DbOptions): Db {
        return client.db(undefined, dbOptions);
    }
}

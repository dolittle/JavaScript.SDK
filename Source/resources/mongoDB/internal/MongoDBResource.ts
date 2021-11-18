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
    getDatabase(cancellation?: Cancellation): Promise<Db>;
    getDatabase(databaseSettingsCallback?: DatabaseSettingsCallback, cancellation?: Cancellation): Promise<Db>;
    async getDatabase(maybeCancellationOrDatabaseSettingsCallback: Cancellation | DatabaseSettingsCallback | undefined, maybeCancellation?: Cancellation): Promise<Db> {
        const settingsCallback = this.getDatabaseSettingsCallback(maybeCancellationOrDatabaseSettingsCallback);
        const cancellation = this.getCancellation(maybeCancellationOrDatabaseSettingsCallback, maybeCancellation);

        if (!this._openClients.has(this.tenant.toString())) {
            const connectionString = await this.get(this._method, response => response.getConnectionstring(), cancellation);
            this._openClients.set(this.tenant.toString(), await MongoClient.connect(connectionString));
        }
        return this.getDatabaseFromClient(
            this._openClients.get(this.tenant.toString())!,
            this.getDatabaseSettings(settingsCallback));
    }

    /** @inheritdoc */
    protected createRequest(): GetRequest {
        const request = new GetRequest();
        request.setCallcontext(this.createCallContext());
        return request;
    }

    private getDatabaseSettingsCallback(maybeCancellationOrDatabaseSettingsCallback: Cancellation | DatabaseSettingsCallback | undefined): DatabaseSettingsCallback | undefined {
        if (
            maybeCancellationOrDatabaseSettingsCallback instanceof Cancellation ||
            maybeCancellationOrDatabaseSettingsCallback === undefined) {
            return undefined;
        }

        return maybeCancellationOrDatabaseSettingsCallback;
    }

    private getCancellation(maybeCancellationOrDatabaseSettingsCallback: Cancellation | DatabaseSettingsCallback | undefined, maybeCancellation?: Cancellation): Cancellation | undefined {
        if (maybeCancellationOrDatabaseSettingsCallback instanceof Cancellation) {
            return maybeCancellationOrDatabaseSettingsCallback;
        }

        return maybeCancellation;
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

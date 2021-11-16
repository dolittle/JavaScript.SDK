// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { TenantsClient } from '@dolittle/runtime.contracts/Tenancy/Tenants_grpc_pb';
import { GetAllRequest, Tenant as PbTenant } from '@dolittle/runtime.contracts/Tenancy/Tenants_pb';
import { TenantId } from '@dolittle/sdk.execution';;
import { Cancellation } from '@dolittle/sdk.resilience';
import { reactiveUnary } from '@dolittle/sdk.services';
import { Logger } from 'winston';
import { Tenant, ITenants, FailedToGetAllTenants } from '../index';

/**
 * Represents a client for Tenants and an implementation of @link } that knows how to register Event Types with the Runtime.
 */
export class Tenants extends ITenants {
    /**
     * Initializes an instance of the {@link Tenants} class.
     * @param _client The event types client.
     * @param _executionContext The execution context.
     * @param _logger The logger.
     */
    constructor(private readonly _client: TenantsClient, private readonly _logger: Logger) {
        super();
    }

    /** @inheritdoc */
    async getAll(cancellation: Cancellation = Cancellation.default): Promise<Tenant[]> {
        this._logger.debug('Getting all tenants');
        try {
            const response = await reactiveUnary(this._client, this._client.getAll, new GetAllRequest(), cancellation).toPromise();
            if (!response.hasFailure()) {
                return response.getTenantsList().map(Tenants.createTenant);
            }
            const failure = response.getFailure()!;
            this._logger.warn(`An error occurred while getting all tenants because ${failure.getReason()}. Failure Id '${failure.getId()?.toSDK().toString()}'`);
            throw new FailedToGetAllTenants(failure.getReason());
        } catch (error) {
            this._logger.warn(`An error occurred while getting all tenants because ${error}.`);
            throw error;
        }
    }
    private static createTenant(tenant: PbTenant): Tenant {
        return new Tenant(TenantId.from(tenant.getId()!.toSDK()));
    }
}

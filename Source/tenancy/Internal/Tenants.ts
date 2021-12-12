// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';

import { ExecutionContext, TenantId } from '@dolittle/sdk.execution';
import { ExecutionContexts, Failures, Guids } from '@dolittle/sdk.protobuf';
import { Cancellation } from '@dolittle/sdk.resilience';
import { reactiveUnary } from '@dolittle/sdk.services';

import { TenantsClient } from '@dolittle/runtime.contracts/Tenancy/Tenants_grpc_pb';
import { GetAllRequest, Tenant as PbTenant } from '@dolittle/runtime.contracts/Tenancy/Tenants_pb';

import { FailedToGetAllTenants } from '../FailedToGetAllTenants';
import { ITenants } from '../ITenants';
import { Tenant } from '../Tenant';

/**
 * Represents a client for Tenants and an implementation of {@link ITenants} that knows how to register Event Types with the Runtime.
 */
export class Tenants extends ITenants {
    /**
     * Initializes an instance of the {@link Tenants} class.
     * @param {TenantsClient} _client - The event types client.
     * @param {ExecutionContext} _executionContext - The execution context.
     * @param {Logger} _logger - The logger.
     */
    constructor(
        private readonly _client: TenantsClient,
        readonly _executionContext: ExecutionContext,
        private readonly _logger: Logger
    ) {
        super();
    }

    /** @inheritdoc */
    async getAll(cancellation: Cancellation = Cancellation.default): Promise<Tenant[]> {
        this._logger.debug('Getting all tenants');
        try {
            const request = new GetAllRequest();
            request.setCallcontext(ExecutionContexts.toCallContext(this._executionContext));

            const response = await reactiveUnary(this._client, this._client.getAll, request, cancellation).toPromise();

            if (!response.hasFailure()) {
                return response.getTenantsList().map(Tenants.createTenant);
            }

            const failure = Failures.toSDK(response.getFailure()!);
            this._logger.warn(`An error occurred while getting all tenants because ${failure.reason}. Failure Id '${failure.id}'`);
            throw new FailedToGetAllTenants(failure.reason.value);
        } catch (error) {
            this._logger.warn(`An error occurred while getting all tenants because ${error}.`);
            throw error;
        }
    }

    private static createTenant(tenant: PbTenant): Tenant {
        return new Tenant(TenantId.from(Guids.toSDK(tenant.getId()!)));
    }
}

// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';

import { ExecutionContext, TenantId } from '@dolittle/sdk.execution';
import { ExecutionContexts } from '@dolittle/sdk.protobuf';
import { Cancellation } from '@dolittle/sdk.resilience';
import { reactiveUnary, UnaryMethod } from '@dolittle/sdk.services';

import { Failure } from '@dolittle/contracts/Protobuf/Failure_pb';
import { CallRequestContext } from '@dolittle/contracts/Services/CallContext_pb';
import { ResourcesClient } from '@dolittle/runtime.contracts/Resources/Resources_grpc_pb';

import { FailedToGetResourceForTenant } from '../FailedToGetResourceForTenant';
import { ResourceName } from '../ResourceName';

/**
 * Represents a system that can create resources by fetching configuration from the Runtime.
 * @template TResource - The type of the resource.
 * @template TRequest - The type of the resource configuration request.
 * @template TResponse - The type of the resource configuration response.
 */
export abstract class ResourceCreator<TResource, TRequest, TResponse> {

    /**
     * Initialises a new instance of the {@link ResourceCreator} class.
     * @param {ResourceName} _resource - The name of the resource type.
     * @param {UnaryMethod} _method - The gRPC method to call to get the resource configuration from the Runtime.
     * @param {ResourcesClient} _client - The resources client to make requests to the Runtime with.
     * @param {ExecutionContext} _executionContext - The base execution context for the client.
     * @param {Logger} _logger - The logger to use for logging.
     */
    protected constructor(
        private readonly _resource: ResourceName,
        private readonly _method: UnaryMethod<TRequest, TResponse>,
        private readonly _client: ResourcesClient,
        private readonly _executionContext: ExecutionContext,
        private readonly _logger: Logger,
    ) {}

    /**
     * Creates the resource for the provided tenant by fetching configuration from the Runtime.
     * @param {TenantId} tenant - The tenant id to create the resource for.
     * @param {Cancellation} cancellation - An optional cancellation to cancel the operation.
     * @returns {Promise} - A {@link Promise} that, when resolved, returns the created resource.
     */
    async createFor(tenant: TenantId, cancellation: Cancellation = Cancellation.default): Promise<TResource> {
        try {
            this._logger.debug(`Getting ${this._resource} resource for tenant ${tenant}`);

            const executionContext = this._executionContext.forTenant(tenant);
            const callContext = ExecutionContexts.toCallContext(executionContext);

            const request = this.createResourceRequest(callContext);
            const response = await reactiveUnary(this._client, this._method, request, cancellation).toPromise();

            const [requestFailed, requestFailure] = this.requestFailed(response);
            if (requestFailed) {
                this._logger.warn(`Failed getting ${this._resource} resource for tenant ${tenant} because ${requestFailure!.getReason()}`);
                throw new FailedToGetResourceForTenant(this._resource, tenant, requestFailure!.getReason());
            }

            return await this.createResourceFrom(response);
        } catch (error) {
            if (error instanceof FailedToGetResourceForTenant) {
                throw error;
            }

            this._logger.warn(`Failed getting ${this._resource} resource for tenant ${tenant}}`, error);
            throw new FailedToGetResourceForTenant(this._resource, tenant, error as any);
        }
    }

    /**
     * Creates a request to get the resource configuration using the provided call context.
     * @param {CallRequestContext} callContext - The call context to use for the request containing the tenant id.
     * @returns {TRequest} A new request.
     */
    protected abstract createResourceRequest(callContext: CallRequestContext): TRequest;

    /**
     * Checks whether the request failed based on the response.
     * @param {TResponse} response - The response received from the Runtime.
     * @returns {[false] | [true, Failure]} False if the request succeeded, true and the failure if it failed.
     */
    protected abstract requestFailed(response: TResponse): [false] | [true, Failure];

    /**
     * Creates the resource from the configuration received from the Runtime.
     * @param {TResponse} response - The response received from the Runtime.
     * @returns {Promise<TResource>} - A {@link Promise} that, when resolved, returns the created resource.
     */
    protected abstract createResourceFrom(response: TResponse): Promise<TResource>;
}

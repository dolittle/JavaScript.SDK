// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { CallRequestContext } from '@dolittle/contracts/Services/CallContext_pb';
import { Failure } from '@dolittle/contracts/Protobuf/Failure_pb';
import { ResourcesClient } from '@dolittle/runtime.contracts/Resources/Resources_grpc_pb';
import { ExecutionContext, TenantId } from '@dolittle/sdk.execution';
import { callContexts } from '@dolittle/sdk.protobuf';
import { Cancellation } from '@dolittle/sdk.resilience';
import { reactiveUnary, UnaryMethod } from '@dolittle/sdk.services';
import { Logger } from 'winston';

import { FailedToGetResource } from './FailedToGetResource';
import { IResource } from './IResource';
import { ResourceName } from './ResourceName';

/**
 * Defines the type of response expected from the Runtime when getting a resource.
 */
export interface ResponseLike {
    hasFailure: () => boolean;
    getFailure: () => Failure | undefined;
};

/**
 * Represents the base implementation of a {@link IResource}.
 * @typedef TRequest - The type of the request.
 * @typedef TResponse - The type of the response.
 */
export abstract class Resource<TRequest, TResponse extends ResponseLike> extends IResource {
    /**
     * Initializes an instance of the {@link Resource} class.
     * @param {ResourceName} name - The name of the resource.
     * @param {TenantId} tenant - The tenant id.
     * @param {ResourcesClient} _client - The resources client.
     * @param {ExecutionContext} _executionContext - The execution context.
     * @param {Logger} _logger - The logger.
     */
    constructor(
        protected readonly name: ResourceName,
        protected readonly tenant: TenantId,
        private readonly _client: ResourcesClient,
        private readonly _executionContext: ExecutionContext,
        private readonly _logger: Logger) {
        super();
    }

    /**
     * Gets the resource.
     * @typedef TResult - The type of the resource.
     * @param {UnaryMethod<TRequest, TResponse>} method - The method to call.
     * @param {(TResponse) => TResult} getResult - The callback for retrieving the result from the response.
     * @param {Cancellation} cancellation - The optional cancellation token.
     * @returns {Promise<TResult>} The resource.
     */
    protected async get<TResult>(
        method: UnaryMethod<TRequest, TResponse>,
        getResult: (response: TResponse) => TResult,
        cancellation: Cancellation = Cancellation.default): Promise<TResult> {
        try {
            this._logger.debug(`Getting ${this.name.value} resource for tenant ${this.tenant.value}`);
            const response = await reactiveUnary(this._client, method, this.createRequest(), cancellation).toPromise();
            if (!response.hasFailure()) {
                return getResult(response);
            }
            const failure = response.getFailure()!;
            this._logger.warn(`Failed getting ${this.name.value} resource for tenant ${this.tenant.value} because ${failure.getReason()}`);
            throw new FailedToGetResource(this.name, this.tenant, failure.getReason());

        } catch (error) {
            this._logger.warn(`Failed getting ${this.name.value} resource for tenant ${this.tenant.value}}`, error);
            throw new FailedToGetResource(this.name, this.tenant, error as any);
        }
    }

    /**
     * Creates the {CallRequestContext} from the {@link ExecutionContext}.
     * @returns {CallRequestContext} The created call request context.
     */
    protected createCallContext(): CallRequestContext {
        return callContexts.toProtobuf(this._executionContext);
    }

    /**
     * Creates the request.
     * @returns {TRequest} The created request.
     */
    protected abstract createRequest(): TRequest;

}

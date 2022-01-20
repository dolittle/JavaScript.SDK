// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Observable } from 'rxjs';
import { Logger } from 'winston';

import { ITenantServiceProviders } from '@dolittle/sdk.dependencyinversion';
import { Cancellation, RetryPolicy } from '@dolittle/sdk.resilience';
import { ExecutionContext } from '@dolittle/sdk.execution';

/**
 * Defines a system that handles the behavior of event processors that registers with the Runtime and handles processing requests.
 * @template TClient - The type of the gRPC client to use to connect.
 */
export abstract class IEventProcessor<TClient> {
    /**
     * Registers the event processor with the Runtime, and if successful starts handling requests.
     * @param {TClient} client - The client to use to initiate the reverse call client.
     * @param {ExecutionContext} executionContext - The base execution context for the processor.
     * @param {ITenantServiceProviders} services - Used to resolve services while handling requests.
     * @param {Logger} logger - Used for logging.
     * @param {number} pingInterval - The ping interval to configure the processor with.
     * @param {Cancellation} cancellation - Used to cancel the registration and processing.
     * @returns {Observable} Representing the connection to the Runtime.
     */
    abstract register(client: TClient, executionContext: ExecutionContext, services: ITenantServiceProviders, logger: Logger, pingInterval: number, cancellation: Cancellation): Observable<void>;

    /**
     * Registers a processor with a policy.
     * @param {RetryPolicy} policy - The policy to register with.
     * @param {TClient} client - The client to use to initiate the reverse call client.
     * @param {ExecutionContext} executionContext - The base execution context for the processor.
     * @param {ITenantServiceProviders} services - Used to resolve services while handling requests.
     * @param {Logger} logger - Used for logging.
     * @param {number} pingInterval - The ping interval to configure the processor with.
     * @param {Cancellation} cancellation - The cancellation.
     * @returns {Observable} Repressenting the connection to the Runtime.
     */
    abstract registerWithPolicy(policy: RetryPolicy, client: TClient, executionContext: ExecutionContext, services: ITenantServiceProviders, logger: Logger, pingInterval: number, cancellation: Cancellation): Observable<void>;

    /**
     * Registers a processor forever with a policy. Even if the registration completes, the repeat() call
     * will try to re-register.
     * @param {RetryPolicy} policy - The policy to register with.
     * @param {TClient} client - The client to use to initiate the reverse call client.
     * @param {ExecutionContext} executionContext - The base execution context for the processor.
     * @param {ITenantServiceProviders} services - Used to resolve services while handling requests.
     * @param {Logger} logger - Used for logging.
     * @param {number} pingInterval - The ping interval to configure the processor with.
     * @param {Cancellation} cancellation - The cancellation.
     * @returns {Observable} Repressenting the connection to the Runtime.
     */
    abstract registerForeverWithPolicy(policy: RetryPolicy, client: TClient, executionContext: ExecutionContext, services: ITenantServiceProviders, logger: Logger, pingInterval: number, cancellation: Cancellation): Observable<void>;
}

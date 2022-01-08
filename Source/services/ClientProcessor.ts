// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { concat, Observable, throwError } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Logger } from 'winston';
import * as grpc from '@grpc/grpc-js';
import { ConceptAs } from '@dolittle/concepts';
import { Guid } from '@dolittle/rudiments';

import { IServiceProvider, ITenantServiceProviders } from '@dolittle/sdk.dependencyinversion';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { Failures } from '@dolittle/sdk.protobuf';
import { Cancellation, RetryPolicy, retryWithPolicy } from '@dolittle/sdk.resilience';

import { Failure } from '@dolittle/contracts/Protobuf/Failure_pb';

import { IReverseCallClient } from './IReverseCallClient';
import { RegistrationFailed } from './RegistrationFailed';
import { ProcessorShouldNeverComplete } from './ProcessorShouldNeverComplete';

/**
 * Defines a system for registering a processor that handles request from the Runtime.
 * @template TIdentifier - The type of the identifier.
 * @template TClient - The type of the gRPC client to use to connect.
 * @template TRegisterArguments - The type of the registration arguments.
 * @template TRegisterResponse - The type of the registration response.
 * @template TRequest - The type of the requests.
 * @template TResponse - The type of the responses.
 */
export abstract class ClientProcessor<TIdentifier extends ConceptAs<Guid, string>, TClient extends grpc.Client, TRegisterArguments, TRegisterResponse, TRequest, TResponse> {
    /**
     * Initializes a new {@link ClientProcessor}.
     * @param {string} _kind - What kind of a processor it is.
     * @param {TIdentifier} _identifier - The unique identifier for the processor.
     */
    constructor(
        protected readonly _kind: string,
        protected readonly _identifier: TIdentifier
    ) { }

    /**
     * Registers a processor with the Runtime, and if successful starts handling requests.
     * @param {TClient} client - The client to use to initiate the reverse call client.
     * @param {ExecutionContext} executionContext - The base execution context for the processor.
     * @param {ITenantServiceProviders} services - Used to resolve services while handling requests.
     * @param {Logger} logger - Used for logging.
     * @param {number} pingInterval - The ping interval to configure the processor with.
     * @param {Cancellation} cancellation - Used to cancel the registration and processing.
     * @returns {Observable} Representing the connection to the Runtime.
     */
    register(client: TClient, executionContext: ExecutionContext, services: ITenantServiceProviders, logger: Logger, pingInterval: number, cancellation: Cancellation): Observable<void> {
        const reverseCallClient = this.createClient(
            client,
            this.registerArguments,
            (request: TRequest, requestExecutionContext: ExecutionContext) => {
                const tenantServiceProvider = services.forTenant(requestExecutionContext.tenantId);
                return this.catchingHandle(request, requestExecutionContext, tenantServiceProvider, logger);
            },
            executionContext,
            pingInterval,
            logger,
            cancellation);

        return reverseCallClient.pipe(
            map((registerResponse) => {
                const pbFailure = this.getFailureFromRegisterResponse(registerResponse);
                if (pbFailure !== undefined) {
                    const failure = Failures.toSDK(pbFailure);

                    logger.error(`${this._kind} ${this._identifier} failed during registration. ${failure.reason}`);

                    throw new RegistrationFailed(this._kind, this._identifier.value, failure);
                } else {
                    logger.info(`${this._kind} ${this._identifier} registered with the Runtime, start handling requests.`);
                }
            }),
            tap({
                error: (error) => {
                    if (error instanceof RegistrationFailed) return;

                    logger.error(`${this._kind} ${this._identifier} failed during processing of requests. ${error.message}`);
                },
                complete: () => {
                    logger.debug(`${this._kind} ${this._identifier} handling of requests completed.`);
                }
            })
        );
    }

    /**
     * Registers a processor with a policy that specifies which and how to retry (reconnect) on errors.
     * @param {RetryPolicy} policy - The policy to register with.
     * @param {TClient} client - The client to use to initiate the reverse call client.
     * @param {ExecutionContext} executionContext - The base execution context for the processor.
     * @param {ITenantServiceProviders} services - Used to resolve services while handling requests.
     * @param {Logger} logger - Used for logging.
     * @param {number} pingInterval - The ping interval to configure the processor with.
     * @param {Cancellation} cancellation - The cancellation.
     * @returns {Observable} Repressenting the connection to the Runtime.
     */
    registerWithPolicy(policy: RetryPolicy, client: TClient, executionContext: ExecutionContext, services: ITenantServiceProviders, logger: Logger, pingInterval: number, cancellation: Cancellation): Observable<void> {
        const registration = this.register(client, executionContext, services, logger, pingInterval, cancellation);
        return retryWithPolicy(registration, policy, cancellation);
    }

    /**
     * Registers a processor forever with a policy that specifies which and how to retry (reconnect) on errors.
     * If the processor completes an error is thrown that will be handed over to the policy to deal with as any other errors.
     * @param {RetryPolicy} policy - The policy to register with.
     * @param {TClient} client - The client to use to initiate the reverse call client.
     * @param {ExecutionContext} executionContext - The base execution context for the processor.
     * @param {ITenantServiceProviders} services - Used to resolve services while handling requests.
     * @param {Logger} logger - Used for logging.
     * @param {number} pingInterval - The ping interval to configure the processor with.
     * @param {Cancellation} cancellation - The cancellation.
     * @returns {Observable} Repressenting the connection to the Runtime.
     */
    registerForeverWithPolicy(policy: RetryPolicy, client: TClient, executionContext: ExecutionContext, services: ITenantServiceProviders, logger: Logger, pingInterval: number, cancellation: Cancellation): Observable<void> {
        const registration = this.register(client, executionContext, services, logger, pingInterval, cancellation);
        const registrationThatFailsOnComplete = concat(registration, throwError(new ProcessorShouldNeverComplete()));
        return retryWithPolicy(registrationThatFailsOnComplete, policy, cancellation);
    }

    /**
     * Get the registration arguments for a processor.
     */
    protected abstract get registerArguments(): TRegisterArguments;

    /**
     * Get a failure from the registration response.
     * @param {TRegisterResponse} response - The registration response.
     * @returns {Failure} The failure to return to Runtime.
     */
    protected abstract getFailureFromRegisterResponse(response: TRegisterResponse): Failure | undefined;

    /**
     * Creates a reverse call client.
     * @param {TClient} client - The client to use to initiate the reverse call client.
     * @param {TRegisterArguments} registerArguments - The registration arguments of the reverse call client.
     * @param {(request: TRequest, executionContext: ExecutionContext) => Promise<TResponse>} callback - The callback to pass to the reverse call client.
     * @param {ExecutionContext} executionContext - The base execution context for the processor.
     * @param {number} pingInterval - The ping interval to configure the client with.
     * @param {Logger} logger - Used for logging.
     * @param {Cancellation} cancellation - The cancellation used to stop the client.
     */
    protected abstract createClient(
        client: TClient,
        registerArguments: TRegisterArguments,
        callback: (request: TRequest, executionContext: ExecutionContext) => Promise<TResponse>,
        executionContext: ExecutionContext,
        pingInterval: number,
        logger: Logger,
        cancellation: Cancellation): IReverseCallClient<TRegisterResponse>;

    /**
     * Wrapper around the handle() method to catch errors and set them to the response.
     * @param {TRequest} request - The request from the Runtime.
     * @param {ExecutionContext} executionContext - The execution context for the current processing request.
     * @param {IServiceProvider} services - The service provider to use for resolving services while handling the current request.
     * @param {Logger} logger - The logger to use for logging.
     */
    protected abstract catchingHandle(request: TRequest, executionContext: ExecutionContext, services: IServiceProvider, logger: Logger): Promise<TResponse>;
}

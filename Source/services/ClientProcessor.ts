// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ConceptAs } from '@dolittle/concepts';
import { Failure } from '@dolittle/contracts/Protobuf/Failure_pb';
import { Guid } from '@dolittle/rudiments';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { failures } from '@dolittle/sdk.protobuf';
import { Cancellation, RetryPolicy, retryWithPolicy } from '@dolittle/sdk.resilience';
import { Observable } from 'rxjs';
import { repeat } from 'rxjs/operators';
import { Logger } from 'winston';
import { IReverseCallClient } from './IReverseCallClient';
import { RegistrationFailed } from './RegistrationFailed';

/**
 * Defines a system for registering a processor that handles request from the Runtime.
 * @typedef TIdentifier - The type of the identifier.
 * @typedef TRegisterArguments - The type of the registration arguments.
 * @typedef TRegisterResponse - The type of the registration response.
 * @typedef TRequest - The type of the requests.
 * @typedef TResponse - The type of the responses.
 */
export abstract class ClientProcessor<TIdentifier extends ConceptAs<Guid, string>, TRegisterArguments, TRegisterResponse, TRequest, TResponse> {
    private _pingTimeout = 1;

    /**
     * Initializes a new {@link ClientProcessor}.
     * @param {string} _kind - What kind of a processor it is.
     * @param {TIdentifier} _identifier - The unique identifier for the processor.
     * @param {Logger} _logger - The logger.
     */
    constructor(
        protected readonly _kind: string,
        protected readonly _identifier: TIdentifier,
        protected readonly _logger: Logger) { }

    /**
     * Registers a processor with the Runtime, and if successful starts handling requests.
     * @param {Cancellation} cancellation - Used to cancel the registration and processing.
     * @returns {Observable} Representing the connection to the Runtime.
     */
    register(cancellation: Cancellation): Observable<void> {
        const client = this.createClient(
            this.registerArguments,
            (request: TRequest, executionContext: ExecutionContext) => this.catchingHandle(request, executionContext),
            this._pingTimeout,
            cancellation);
        return new Observable<void>(subscriber => {
            this._logger.debug(`Registering ${this._kind} ${this._identifier} with the Runtime.`);
            client.subscribe({
                next: (message: TRegisterResponse) => {
                    const failure = this.getFailureFromRegisterResponse(message);
                    if (failure) {
                        subscriber.error(new RegistrationFailed(this._kind, this._identifier.value, failures.toSDK(failure)!));
                    } else {
                        this._logger.info(`${this._kind} ${this._identifier} registered with the Runtime, start handling requests.`);
                    }
                },
                error: (error: Error) => {
                    subscriber.error(error);
                },
                complete: () => {
                    this._logger.debug(`${this._kind} ${this._identifier} handling of requests completed.`);
                    subscriber.complete();
                },
            });
        });
    }

    /**
     * Registers a processor with a policy.
     * @param {RetryPolicy} policy - The policy to register with.
     * @param {Cancellation} cancellation - The cancellation.
     * @returns {Observable} Repressenting the connection to the Runtime.
     */
    registerWithPolicy(policy: RetryPolicy, cancellation: Cancellation): Observable<void> {
        return retryWithPolicy(this.register(cancellation), policy, cancellation);
    }

    /**
     * Registers a processor forever with a policy. Even if the registration completes, the repeat() call
     * will try to re-register.
     * @param {RetryPolicy} policy - The policy to register with.
     * @param {Cancellation} cancellation - The cancellation.
     * @returns {Observable} Repressenting the connection to the Runtime.
     */
    registerForeverWithPolicy(policy: RetryPolicy, cancellation: Cancellation): Observable<void> {
        return this.registerWithPolicy(policy, cancellation).pipe(repeat());
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
    protected abstract getFailureFromRegisterResponse(response: TRegisterResponse): Failure | undefined;

    /**
     * Creates a reverse call client.
     * @param registerArguments
     * @param callback
     * @param pingTimeout
     * @param cancellation
     */
    protected abstract createClient(
        registerArguments: TRegisterArguments,
        callback: (request: TRequest, executionContext: ExecutionContext) => Promise<TResponse>,
        pingTimeout: number,
        cancellation: Cancellation): IReverseCallClient<TRegisterResponse>;

    /**
     * Handles the request from the Runtime.
     * @param {TRequest} request - The request from the Runtime.
     * @param {ExecutionContext} executionContext - The execution context.
     */
    protected abstract handle(request: TRequest, executionContext: ExecutionContext): Promise<TResponse>;

    /**
     * Wrapper around the handle() method to catch errors and set them to the response.
     * @param {TRequest} request - The request from the Runtime.
     * @param {ExecutionContext} executionContext - The execution context.
     */
    protected abstract catchingHandle(request: TRequest, executionContext: ExecutionContext): Promise<TResponse>;
}

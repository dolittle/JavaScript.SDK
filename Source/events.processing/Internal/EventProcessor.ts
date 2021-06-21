// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ConceptAs } from '@dolittle/concepts';
import { Failure as PbFailure } from '@dolittle/contracts/Protobuf/Failure_pb';
import { Guid } from '@dolittle/rudiments';
import { ProcessorFailure, RetryProcessingState } from '@dolittle/runtime.contracts/Events.Processing/Processors_pb';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { failures } from '@dolittle/sdk.protobuf';
import { Cancellation, RetryPolicy, retryWithPolicy } from '@dolittle/sdk.resilience';
import { IReverseCallClient } from '@dolittle/sdk.services';
import { Duration } from 'google-protobuf/google/protobuf/duration_pb';
import { Observable } from 'rxjs';
import { repeat } from 'rxjs/operators';
import { Logger } from 'winston';
import { RegistrationFailed } from '..';
import { IEventProcessor } from './IEventProcessor';

/**
 * Partial implementation of {@link IEventProcessor}.
 */
export abstract class EventProcessor<TIdentifier extends ConceptAs<Guid, string>, TRegisterArguments, TRegisterResponse, TRequest, TResponse> extends IEventProcessor {
    private _pingTimeout = 1;

    constructor(
        protected _kind: string,
        protected _identifier: TIdentifier,
        protected _logger: Logger) {
        super();
    }

    /** @inheritdoc */
    register(cancellation: Cancellation): Observable<never> {
        const client = this.createClient(
            this.registerArguments,
            (request: TRequest, executionContext: ExecutionContext) => this.catchingHandle(request, executionContext),
            this._pingTimeout,
            cancellation);
        return new Observable<never>(subscriber => {
            this._logger.debug(`Registering ${this._kind} ${this._identifier} with the Runtime.`);
            client.subscribe({
                next: (message: TRegisterResponse) => {
                    const failure = this.getFailureFromRegisterResponse(message);
                    if (failure) {
                        subscriber.error(new RegistrationFailed(this._kind, this._identifier.value, failures.toSDK(failure)!));
                    } else {
                        this._logger.debug(`${this._kind} ${this._identifier} registered with the Runtime, start handling requests.`);
                    }
                },
                error: (error: Error) => {
                    subscriber.error(error);
                },
                complete: () => {
                    this._logger.debug(`Registering ${this._kind} ${this._identifier} handling of requests completed.`);
                    subscriber.complete();
                },
            });
        });
    }

    /** @inheritdoc */
    registerWithPolicy(policy: RetryPolicy, cancellation: Cancellation): Observable<never> {
        return retryWithPolicy(this.register(cancellation), policy, cancellation);
    }

    /** @inheritdoc */
    protected abstract get registerArguments (): TRegisterArguments;

    /** @inheritdoc */
    protected abstract createClient (
        registerArguments: TRegisterArguments,
        callback: (request: TRequest, executionContext: ExecutionContext) => Promise<TResponse>,
        pingTimeout: number,
        cancellation: Cancellation): IReverseCallClient<TRegisterResponse>;

    /** @inheritdoc */
    protected abstract getFailureFromRegisterResponse (response: TRegisterResponse): PbFailure | undefined;

    /**
     * Get the retry processing state from the request.
     * @param {TRequest} request The request to get the retry processing state from
     */
    protected abstract getRetryProcessingStateFromRequest (request: TRequest): RetryProcessingState | undefined;

    /**
     * Create a response from a processor failure
     * @param {ProcessorFailure} failure The processor failure.
     */
    protected abstract createResponseFromFailure (failure: ProcessorFailure): TResponse;

    /** @inheritdoc */
    protected abstract handle (request: TRequest, executionContext: ExecutionContext): Promise<TResponse>;

    /** @inheritdoc */
    protected async catchingHandle(request: TRequest, executionContext: ExecutionContext): Promise<TResponse> {
        let retryProcessingState: RetryProcessingState | undefined;
        try {
            retryProcessingState = this.getRetryProcessingStateFromRequest(request);
            return await this.handle(request, executionContext);
        } catch (error) {
            const failure = new ProcessorFailure();
            failure.setReason(`${error}`);
            failure.setRetry(true);
            const retryAttempt = (retryProcessingState?.getRetrycount() ?? 0) + 1;
            const retrySeconds = Math.min(5 * retryAttempt, 60);
            const retryTimeout = new Duration();
            retryTimeout.setSeconds(retrySeconds);
            failure.setRetrytimeout(retryTimeout);

            this._logger.warn(`Processing in ${this._kind} ${this._identifier} failed. ${error.message || error}. Will retry in ${retrySeconds}`);

            return this.createResponseFromFailure(failure);
        }
    }
}

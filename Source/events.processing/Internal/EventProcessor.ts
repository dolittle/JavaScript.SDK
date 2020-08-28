// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Observable } from 'rxjs';
import { repeat } from 'rxjs/operators';
import { Logger } from 'winston';

import { Duration } from 'google-protobuf/google/protobuf/duration_pb';

import { ConceptAs } from '@dolittle/concepts';
import { Guid } from '@dolittle/rudiments';
import { IReverseCallClient } from '@dolittle/sdk.services';
import { failures } from '@dolittle/sdk.protobuf';
import { Cancellation, RetryPolicy, retryWithPolicy } from '@dolittle/sdk.resilience';

import { Failure as PbFailure } from '@dolittle/runtime.contracts/Fundamentals/Protobuf/Failure_pb';
import { RetryProcessingState, ProcessorFailure } from '@dolittle/runtime.contracts/Runtime/Events.Processing/Processors_pb';

import { IEventProcessor, RegistrationFailed } from '../index';

/**
 * Partial implementation of {@link IEventProcessor}.
 */
export abstract class EventProcessor<TIdentifier extends ConceptAs<Guid, string>, TRegisterArguments, TRegisterResponse, TRequest, TResponse> implements IEventProcessor {
    private _pingTimeout = 1;

    constructor(
        private _kind: string,
        protected _identifier: TIdentifier,
        protected _logger: Logger) {}

    /** @inheritdoc */
    register(cancellation: Cancellation): Observable<never> {
        const client = this.createClient(this.registerArguments, (request: TRequest) => this.catchingHandle(request), this._pingTimeout, cancellation);
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
    registerForeverWithPolicy(policy: RetryPolicy, cancellation: Cancellation): Observable<never> {
        return this.registerWithPolicy(policy, cancellation).pipe(repeat());
    }

    protected abstract get registerArguments (): TRegisterArguments;

    protected abstract createClient (registerArguments: TRegisterArguments, callback: (request: TRequest) => Promise<TResponse>, pingTimeout: number, cancellation: Cancellation): IReverseCallClient<TRegisterResponse>;

    protected abstract getFailureFromRegisterResponse (response: TRegisterResponse): PbFailure | undefined;

    protected abstract getRetryProcessingStateFromRequest (request: TRequest): RetryProcessingState | undefined;

    protected abstract createResponseFromFailure (failure: ProcessorFailure): TResponse;

    protected abstract handle (request: TRequest): Promise<TResponse>;

    private async catchingHandle(request: TRequest): Promise<TResponse> {
        let retryProcessingState: RetryProcessingState | undefined;
        try {
            retryProcessingState = this.getRetryProcessingStateFromRequest(request);
            return await this.handle(request);
        } catch (error) {
            const failure = new ProcessorFailure();
            failure.setReason(`${error}`);
            failure.setRetry(true);
            const retryAttempt = (retryProcessingState?.getRetrycount() ?? 0) + 1;
            const retrySeconds = Math.min(5 * retryAttempt, 60);
            const retryTimeout = new Duration();
            retryTimeout.setSeconds(retrySeconds);
            failure.setRetrytimeout(retryTimeout);

            this._logger.warn(`Processing in ${this._kind} ${this._identifier} failed. Will retry in ${retrySeconds}`);

            return this.createResponseFromFailure(failure);
        }
    }
}

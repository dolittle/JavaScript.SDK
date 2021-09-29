// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';

import { Duration } from 'google-protobuf/google/protobuf/duration_pb';

import { ConceptAs } from '@dolittle/concepts';
import { Guid } from '@dolittle/rudiments';
import { IReverseCallClient, ClientProcessor  } from '@dolittle/sdk.services';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { Cancellation } from '@dolittle/sdk.resilience';

import { Failure as PbFailure } from '@dolittle/contracts/Protobuf/Failure_pb';
import { RetryProcessingState, ProcessorFailure } from '@dolittle/runtime.contracts/Events.Processing/Processors_pb';

import { IEventProcessor } from './IEventProcessor';

/**
 * Partial implementation of {@link IEventProcessor}.
 */
export abstract class EventProcessor<TIdentifier extends ConceptAs<Guid, string>, TRegisterArguments, TRegisterResponse, TRequest, TResponse> extends ClientProcessor<TIdentifier, TRegisterArguments, TRegisterResponse, TRequest, TResponse>  implements IEventProcessor {

    constructor(
        protected _kind: string,
        protected _identifier: TIdentifier,
        protected _logger: Logger) {
            super(_kind, _identifier, _logger);
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
    protected abstract getFailureFromRegisterResponse (response: TRegisterResponse): PbFailure | undefined;

    /**
     * Get the retry processing state from the request.
     * @param {TRequest} request The request to get the retry processing state from
     */
    protected abstract getRetryProcessingStateFromRequest (request: TRequest): RetryProcessingState | undefined;

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
        } catch (error: any) {
            const failure = new ProcessorFailure();
            failure.setReason(`${error}`);
            failure.setRetry(true);
            const retryAttempt = (retryProcessingState?.getRetrycount() ?? 0) + 1;
            const retrySeconds = Math.min(5 * retryAttempt, 60);
            const retryTimeout = new Duration();
            retryTimeout.setSeconds(retrySeconds);
            failure.setRetrytimeout(retryTimeout);

            this._logger.warn(`Processing in ${this._kind} ${this._identifier} failed. ${error.message || error}. Will retry in ${retrySeconds}`);

            return this.createResponseFromFailure(failure);
        }
    }
}

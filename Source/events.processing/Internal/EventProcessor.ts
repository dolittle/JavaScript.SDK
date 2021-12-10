// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import * as grpc from '@grpc/grpc-js';
import { Logger } from 'winston';

import { Duration } from 'google-protobuf/google/protobuf/duration_pb';

import { IServiceProvider } from '@dolittle/sdk.common';
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
 * @template TIdentifier The type of the event processor identifier.
 * @template TRequest The type of the event processor requests.
 */
export abstract class EventProcessor<TIdentifier extends ConceptAs<Guid, string>, TClient extends grpc.Client, TRegisterArguments, TRegisterResponse, TRequest, TResponse> extends ClientProcessor<TIdentifier, TClient, TRegisterArguments, TRegisterResponse, TRequest, TResponse>  implements IEventProcessor<TClient> {
    /**
     * Initialises a new instance of the {@link EventProcessor} class.
     * @param {string} _kind - The kind of the event processor.
     * @param {TIdentifier} _identifier - The identifier of the event processor.
     */
    constructor(
        protected _kind: string,
        protected _identifier: TIdentifier,
    ) {
        super(_kind, _identifier);
    }

    /** @inheritdoc */
    protected abstract get registerArguments(): TRegisterArguments;

    /** @inheritdoc */
    protected abstract createClient(
        client: TClient,
        registerArguments: TRegisterArguments,
        callback: (request: TRequest, executionContext: ExecutionContext) => Promise<TResponse>,
        executionContext: ExecutionContext,
        pingTimeout: number,
        logger: Logger,
        cancellation: Cancellation): IReverseCallClient<TRegisterResponse>;

    /** @inheritdoc */
    protected abstract getFailureFromRegisterResponse(response: TRegisterResponse): PbFailure | undefined;

    /**
     * Get the retry processing state from the request.
     * @param {TRequest} request - The request to get the retry processing state from.
     */
    protected abstract getRetryProcessingStateFromRequest(request: TRequest): RetryProcessingState | undefined;

    /**
     * Create a response from a processor failure.
     * @param {ProcessorFailure} failure - The processor failure.
     */
    protected abstract createResponseFromFailure(failure: ProcessorFailure): TResponse;

    /** @inheritdoc */
    protected abstract handle(request: TRequest, executionContext: ExecutionContext, services: IServiceProvider, logger: Logger): Promise<TResponse>;

    /** @inheritdoc */
    protected async catchingHandle(request: TRequest, executionContext: ExecutionContext, services: IServiceProvider, logger: Logger): Promise<TResponse> {
        let retryProcessingState: RetryProcessingState | undefined;
        try {
            retryProcessingState = this.getRetryProcessingStateFromRequest(request);
            return await this.handle(request, executionContext, services, logger);
        } catch (error: any) {
            const failure = new ProcessorFailure();
            failure.setReason(`${error}`);
            failure.setRetry(true);
            const retryAttempt = (retryProcessingState?.getRetrycount() ?? 0) + 1;
            const retrySeconds = Math.min(5 * retryAttempt, 60);
            const retryTimeout = new Duration();
            retryTimeout.setSeconds(retrySeconds);
            failure.setRetrytimeout(retryTimeout);

            logger.warn(`Processing in ${this._kind} ${this._identifier} failed. ${error.message || error}. Will retry in ${retrySeconds}`);

            return this.createResponseFromFailure(failure);
        }
    }
}

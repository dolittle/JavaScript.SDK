// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';
import { delay } from 'rxjs/operators';

import { ITenantServiceProviders } from '@dolittle/sdk.dependencyinversion';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { Cancellation, RetryCancelled, retryPipe } from '@dolittle/sdk.resilience';
import { ITrackProcessors } from '@dolittle/sdk.services';

import { FiltersClient } from '@dolittle/contracts/Runtime/Events.Processing/Filters_grpc_pb';

import { IFilterProcessor } from './IFilterProcessor';
import { IFilters } from './IFilters';

/**
 * Represents an implementation of {@link IFilters}.
 */
export class Filters extends IFilters {

    /**
     * Initializes a new instance of {@link Filters}.
     * @param {FiltersClient} _client - The filters client to use.
     * @param {ExecutionContext} _executionContext - The base execution context of the client.
     * @param {ITenantServiceProviders} _services - For resolving services while handling requests.
     * @param {ITrackProcessors} _tracker - The tracker to register the started processors with.
     * @param {Logger} _logger - For logging.
     * @param {number} _pingInterval - The ping interval to configure the reverse call client with.
     */
    constructor(
        private readonly _client: FiltersClient,
        private readonly _executionContext: ExecutionContext,
        private readonly _services: ITenantServiceProviders,
        private readonly _tracker: ITrackProcessors,
        private readonly _logger: Logger,
        private readonly _pingInterval: number,
    ) {
        super();
    }

    /** @inheritdoc */
    register(filterProcessor: IFilterProcessor, cancellation = Cancellation.default): void {
        this._tracker.registerProcessor(
            filterProcessor.registerForeverWithPolicy(
                retryPipe(delay(1000)),
                this._client,
                this._executionContext,
                this._services,
                this._logger,
                this._pingInterval,
                cancellation)
            .subscribe({
                error: (error: Error) => {
                    if (error instanceof RetryCancelled) return;
                    this._logger.error(`Failed to register filter: ${error}`);
                },
                complete: () => {
                    this._logger.error(`Filter registration completed.`);
                }
            }));
    }
}

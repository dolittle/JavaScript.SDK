// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';
import { delay } from 'rxjs/operators';

import { ITenantServiceProviders } from '@dolittle/sdk.common/DependencyInversion';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { Cancellation, retryPipe } from '@dolittle/sdk.resilience';

import { FiltersClient } from '@dolittle/runtime.contracts/Events.Processing/Filters_grpc_pb';

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
     * @param {Logger} _logger - For logging.
     */
    constructor(
        private readonly _client: FiltersClient,
        private readonly _executionContext: ExecutionContext,
        private readonly _services: ITenantServiceProviders,
        private readonly _logger: Logger
    ) {
        super();
    }

    /** @inheritdoc */
    register(filterProcessor: IFilterProcessor, cancellation = Cancellation.default): void {
        filterProcessor.registerForeverWithPolicy(
            retryPipe(delay(1000)),
            this._client,
            this._executionContext,
            this._services,
            this._logger,
            cancellation)
        .subscribe({
            error: (error: Error) => {
                this._logger.error(`Failed to register filter: ${error}`);
            },
            complete: () => {
                this._logger.error(`Filter registration completed.`);
            }
        });
    }
}

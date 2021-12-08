// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';
import { delay } from 'rxjs/operators';

import { ITenantServiceProviders } from '@dolittle/sdk.common/DependencyInversion';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { Cancellation, retryPipe } from '@dolittle/sdk.resilience';

import { ProjectionProcessor } from './Internal';
import { IProjections } from './IProjections';

/**
 * Represents an implementation of {IProjections}.
 */
export class Projections extends IProjections {

    /**
     * Initializes an instance of {@link Projections}.
     * @param {ExecutionContext} _executionContext - The base execution context of the client.
     * @param {ITenantServiceProviders} _services - For resolving services while handling requests.
     * @param {Logger} _logger - For logging.
     */
    constructor(
        private readonly _executionContext: ExecutionContext,
        private readonly _services: ITenantServiceProviders,
        private readonly _logger: Logger
    ) {
        super();
    }

    /** @inheritdoc */
    register<T>(projectionProcessor: ProjectionProcessor<T>, cancellation: Cancellation = Cancellation.default): void {
        projectionProcessor.registerForeverWithPolicy(
            retryPipe(delay(1000)),
            this._executionContext,
            this._services,
            this._logger,
            cancellation)
        .subscribe({
            error: (error: Error) => {
                this._logger.error(`Failed to register projection: ${error}`);
            },
            complete: () => {
                this._logger.error(`Projection registration completed.`);
            }
        });
    }
}

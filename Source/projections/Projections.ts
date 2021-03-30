// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { delay } from 'rxjs/operators';
import { Logger } from 'winston';

import { Cancellation, retryPipe } from '@dolittle/sdk.resilience';

import { IProjections } from './';
import { ProjectionProcessor } from './Internal/';

/**
 * Represents an implementation of {IProjections}
 */
export class Projections implements IProjections {

    /**
     * Initializes an instance of {@link Projections}.
     * @param {Logger} _logger For logging.
     */
    constructor(private readonly _logger: Logger) {
    }

    /** @inheritdoc */
    register<T>(projectionProcessor: ProjectionProcessor<T>, cancellation: Cancellation = Cancellation.default): void {
        projectionProcessor.registerForeverWithPolicy(retryPipe(delay(1000)), cancellation).subscribe({
            error: (error: Error) => {
                this._logger.error(`Failed to register projection: ${error}`);
            },
            complete: () => {
                this._logger.error(`Projection registration completed.`);
            }
        });
    }
}

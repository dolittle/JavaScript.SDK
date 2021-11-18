// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Cancellation, retryPipe } from '@dolittle/sdk.resilience';
import { delay } from 'rxjs/operators';
import { Logger } from 'winston';
import { ProjectionProcessor } from './Internal';
import { IProjections } from './IProjections';

/**
 * Represents an implementation of {IProjections}.
 */
export class Projections extends IProjections {

    /**
     * Initializes an instance of {@link Projections}.
     * @param {Logger} _logger - For logging.
     */
    constructor(private readonly _logger: Logger) {
        super();
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

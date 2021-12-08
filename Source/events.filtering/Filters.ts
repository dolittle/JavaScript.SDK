// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Cancellation, retryPipe } from '@dolittle/sdk.resilience';
import { delay } from 'rxjs/operators';
import { Logger } from 'winston';
import { IFilterProcessor } from './IFilterProcessor';
import { IFilters } from './IFilters';

/**
 * Represents an implementation of {@link IFilters}.
 */
export class Filters extends IFilters {

    /**
     * Initializes a new instance of {@link Filters}.
     * @param {Logger} _logger - Logger for logging.
     */
    constructor(private readonly _logger: Logger) {
        super();
    }

    /** @inheritdoc */
    register(filterProcessor: IFilterProcessor, cancellation = Cancellation.default): void {
        filterProcessor.registerForeverWithPolicy(retryPipe(delay(1000)), this._logger, cancellation).subscribe({
            error: (error: Error) => {
                this._logger.error(`Failed to register filter: ${error}`);
            },
            complete: () => {
                this._logger.error(`Filter registration completed.`);
            }
        });
    }
}

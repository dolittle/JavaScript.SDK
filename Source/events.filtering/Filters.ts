// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Cancellation } from '@dolittle/sdk.services';
import { IFilterProcessor } from './IFilterProcessor';
import { IFilters } from './IFilters';
import { Logger } from 'winston';
import { retryPipe } from '@dolittle/sdk.resilience';
import { delay } from 'rxjs/operators';

export class Filters implements IFilters {
    constructor(private readonly _logger: Logger) {}

    register(filterProcessor: IFilterProcessor, cancellation = Cancellation.default): void {
        filterProcessor.registerForeverWithPolicy(retryPipe(delay(1000)), cancellation).subscribe({
            error: (error: Error) => {
                this._logger.error(`Failed to register filter: ${error}`);
            },
            complete: () => {
                this._logger.error(`Filter registartion completed.`);
            }
        });
    }
}

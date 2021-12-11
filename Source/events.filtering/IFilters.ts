// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Cancellation } from '@dolittle/sdk.resilience';
import { IFilterProcessor } from './IFilterProcessor';

/**
 * Defines the API for working with filters.
 */
export abstract class IFilters {

    /**
     * Register a {@link IFilterProcessor} for processing events for filtering.
     * @param {IFilterProcessor} filterProcessor - The filter processor.
     * @param {Cancellation} [cancellation] - Optional cancellation.
     */
    abstract register(filterProcessor: IFilterProcessor, cancellation?: Cancellation): void;
}

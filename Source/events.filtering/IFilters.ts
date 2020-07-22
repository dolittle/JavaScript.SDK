// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IFilterProcessor } from './IFilterProcessor';
import { Cancellation } from '@dolittle/sdk.resilience';

export interface IFilters {
    register(filterProcessor: IFilterProcessor, cancellation?: Cancellation): void;
}

// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IFilterProcessor } from './IFilterProcessor';

export interface IFilters {
    register(filterProcessor: IFilterProcessor): void;
}

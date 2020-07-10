// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Cancellation } from '@dolittle/sdk.services';
import { IFilterProcessor } from './IFilterProcessor';
import { IFilters } from './IFilters';

export class Filters implements IFilters {
    register(filterProcessor: IFilterProcessor): void {
        filterProcessor.register(Cancellation.default).subscribe({
            error: (error: Error) => {
                console.log('Failed to register filter', error);
            },
            complete: () => {
                console.log('Filter registration completed!');
            }
        });
    }
}

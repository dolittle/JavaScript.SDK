// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

// Sample code for the tutorial at https://dolittle.io/tutorials/projections/typescript/

import { eventType } from '@dolittle/sdk.events';

@eventType('1844473f-d714-4327-8b7f-5b3c2bdfc26a')
export class DishPrepared {
    constructor(readonly Dish: string, readonly Chef: string) {}
}

// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// Sample code for the tutorial at https://dolittle.io/tutorials/projections/typescript/

import { eventType } from '@dolittle/sdk.events';

@eventType('551bbdc1-6ef2-4a9d-9a2e-91b380632b59')
export class DishCreated {
    constructor(readonly Dish: string, readonly Chef: string) {}
}

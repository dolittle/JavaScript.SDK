// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// Sample code for the tutorial at https://dolittle.io/tutorials/projections/typescript/

import { eventType } from '@dolittle/sdk.events';

@eventType('e6b18cdd-5abd-402a-92b7-ec32941def4a')
export class DishRemoved {
    constructor(readonly Dish: string) {}
}

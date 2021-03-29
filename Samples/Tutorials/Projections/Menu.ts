// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// Sample code for the tutorial at https://dolittle.io/tutorials/getting-started/projections/

import { EventContext } from '@dolittle/sdk.events';
import { on, projection } from '@dolittle/sdk.projections';
import { DishPrepared } from './DishPrepared';

@projection('5b22e60e-f8db-494e-af5c-e8728acb2470')
export class Menu {
    dishes: string[] = [];

    @on(DishPrepared, _ => _.keyFromEventSource())
    on(event: DishPrepared, ctx: EventContext) {
        if (!this.dishes.includes(event.Dish))
            this.dishes.push(event.Dish);
    }
}

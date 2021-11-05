// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// Sample code for the tutorial at https://dolittle.io/tutorials/aggregates/

import { aggregateRoot, AggregateRoot, on } from '@dolittle/sdk.aggregates';
import { EventSourceId } from '@dolittle/sdk.events';
import { DishPrepared } from './DishPrepared';

@aggregateRoot('01ad9a9f-711f-47a8-8549-43320f782a1e')
export class Kitchen extends AggregateRoot {
    private _ingredients: number = 2;

    constructor(eventSourceId: EventSourceId) {
        super(eventSourceId);
    }

    prepareDish(dish: string, chef: string) {
        if (this._ingredients <= 0) throw new Error('We have run out of ingredients, sorry!');
        this.apply(new DishPrepared(dish, chef));
        console.log(`Kitchen ${this.eventSourceId} prepared a ${dish}, there are ${this._ingredients} ingredients left.`);
    }

    @on(DishPrepared)
    onDishPrepared(event: DishPrepared) {
        this._ingredients--;
    }
}

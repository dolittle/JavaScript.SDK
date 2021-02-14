// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// Sample code for the tutorial at https://dolittle.io/tutorials/getting-started/typescript/

import { aggregateRoot, AggregateRoot, on } from '@dolittle/sdk.aggregates';
import { EventSourceId } from '@dolittle/sdk.events';
import { DishPrepared } from './DishPrepared';

@aggregateRoot('e5b17be9-4873-4526-99a1-76a5c31c0dad')
export class Kitchen extends AggregateRoot {
    private _counter: number = 0;

    constructor(eventSourceId: EventSourceId) {
        super(eventSourceId);
    }

    prepareDish(dish: string, chef: string) {
        this.apply(new DishPrepared(dish, chef));
    }


    @on(DishPrepared)
    onDishPrepared(event: DishPrepared) {
        this._counter++;
    }
}
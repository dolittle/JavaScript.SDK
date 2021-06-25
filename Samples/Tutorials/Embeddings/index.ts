// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// Sample code for the tutorial at https://dolittle.io/docs/tutorials/projections/

import { Client } from '@dolittle/sdk';
import { TenantId } from '@dolittle/sdk.execution';
import { DishCounter } from './DishCounter';
import { DishPrepared } from './DishPrepared';
import { DishRemoved } from './DishRemoved';

const client = Client
    .forMicroservice('f39b1f61-d360-4675-b859-53c05c87c0e6')
    .withEventTypes(eventTypes => {
        eventTypes.register(DishPrepared);
        eventTypes.register(DishRemoved);
    })
    // .withEventHandlers(builder =>
    //     builder.register(DishHandler))
    .withEmbeddings(builder => {
        builder.register(DishCounter);
    })
    .build();

(async () => {

    setTimeout(async () => {

        const tacoCounter = new DishCounter();
        tacoCounter.dish = 'Taco';
        tacoCounter.numberOfTimesPrepared = 5;

        const burritoCounter = new DishCounter();
        burritoCounter.dish = 'Burrito'
        burritoCounter.numberOfTimesPrepared = 3;

        const wrapCounter = new DishCounter();
        wrapCounter.dish = 'Wrap'
        wrapCounter.numberOfTimesPrepared = 2;

        [tacoCounter, burritoCounter, wrapCounter]
            .map(async counter => {
                // console.log(`Updating dish: ${counter.dish}`);
                // await client.embeddings
                //     .forTenant(TenantId.development)
                //     .update(DishCounter, counter.dish, counter);

                // const counterState = await client.embeddings
                //     .forTenant(TenantId.development)
                //     .get(DishCounter, counter.dish);
                // console.log('Got dish:', counterState.state);

                console.log(`Deleting dish counter: ${counter}`);
                await client.embeddings
                    .forTenant(TenantId.development)
                    .delete(DishCounter, counter.dish);

                const deletedCounter = await client.embeddings
                    .forTenant(TenantId.development)
                    .get(DishCounter, counter.dish);
                console.log(`Got a deleted, initial dish counter: ${JSON.stringify(deletedCounter.state)}`);
            });

        // const allDishCounters = await client.embeddings
        //     .forTenant(TenantId.development)
        //     .getAll(DishCounter);
        // console.log(`Got all dishes: ${JSON.stringify(allDishCounters)}`);

        // const dishCounterKeys = await client.embeddings
        //     .forTenant(TenantId.development)
        //     .getKeys(DishCounter);

        // console.log(`Got all keys: ${dishCounterKeys}`);

    }, 5000);
})();

// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// Sample code for the tutorial at https://dolittle.io/docs/tutorials/projections/

import { Client } from '@dolittle/sdk';
import { TenantId } from '@dolittle/sdk.execution';
import { ProjectionResult } from '@dolittle/sdk.projections';
import { Chef } from './Chef';
import { ChefFired } from './ChefFired';
import { DishCounter } from './DishCounter';
import { DishHandler } from './DishHandler';
import { DishPrepared } from './DishPrepared';
import { DishRemoved } from './DishRemoved';

const client = Client
    .forMicroservice('f39b1f61-d360-4675-b859-53c05c87c0e6')
    .withEventTypes(eventTypes => {
        eventTypes.register(DishPrepared);
        eventTypes.register(DishRemoved);
        eventTypes.register(ChefFired);
    })
    .withEventHandlers(builder =>
        builder.register(DishHandler))
    .withEmbeddings(builder => {
        builder.register(DishCounter);
        builder.createEmbedding('0767bc04-bc03-40b8-a0be-5f6c6130f68b')
            .forReadModel(Chef)
            .compare((receivedState, currentState, embeddingContext) => {
                return receivedState.dishes
                    .filter((dish: string) => !currentState.dishes.includes(dish))
                    .map((missingDish: string) => new DishPrepared(missingDish, embeddingContext.key.value));
            })
            .deleteMethod((currentState, embeddingContext) => {
                return new ChefFired(currentState.name);
            })
            .on(DishPrepared, (chef, event, context) => {
                chef.name = event.Chef;
                if (!chef.dishes.includes(event.Dish)) chef.dishes.push(event.Dish);
                return chef;
            })
            .on(ChefFired, (chef, event, context) => {
                return ProjectionResult.delete;
            });
        })
    .build();

(async () => {

    const updatedState = await client.embeddings
        .forTenant(TenantId.development)
        .update<DishCounter>(DishCounter, 'some key', new DishCounter());
    await client.embeddings
        .forTenant(TenantId.development)
        .delete(DishCounter, 'some key');
    const tacoCounterState = await client.embeddings
        .forTenant(TenantId.development)
        .get(DishCounter, 'some key');
    const allDishCounters = await client.embeddings
        .forTenant(TenantId.development)
        .getAll(DishCounter);
    const dishCounterKeys = await client.embeddings
        .forTenant(TenantId.development)
        .getKeys(DishCounter);


    setTimeout(async () => {
        for (const [dish, { state: counter }] of await client.embeddings.forTenant(TenantId.development).getAll(DishCounter)) {
            console.log(`The kitchen has prepared ${dish} ${counter.numberOfTimesPrepared} times`);
        }

        const chef = await client.embeddings.forTenant(TenantId.development).get<Chef>(Chef, 'Mrs. Tex Mex');
        console.log(`${chef.key} has prepared ${chef.state.dishes}`);

        const dishes = await client.embeddings.forTenant(TenantId.development).getKeys(DishCounter);
        console.log(`Got dem dish keys: ${dishes}`);
    }, 1000);
})();

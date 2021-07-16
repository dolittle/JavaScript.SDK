// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// Sample code for the tutorial at https://dolittle.io/docs/tutorials/embeddings/

import { Client } from '@dolittle/sdk';
import { TenantId } from '@dolittle/sdk.execution';
import { ProjectionResult } from '@dolittle/sdk.projections';
import { Chef } from './Chef';
import { ChefFired } from './ChefFired';
import { ChefHired } from './ChefHired';
import { DishCounter } from './DishCounter';
import { DishHandler } from './DishHandler';
import { DishPrepared } from './DishPrepared';
import { DishRemoved } from './DishRemoved';
import { CouldNotResolveUpdateToEvents } from '@dolittle/sdk.embeddings/CouldNotResolveUpdateToEvents';

const client = Client
    .forMicroservice('f39b1f61-d360-4675-b859-53c05c87c0e6')
    .withEventTypes(eventTypes => {
        eventTypes.register(DishPrepared);
        eventTypes.register(DishRemoved);
        eventTypes.register(ChefHired);
        eventTypes.register(ChefFired);
    })
    .withEventHandlers(builder =>
        builder.register(DishHandler))
    .withEmbeddings(builder => {
        builder.register(DishCounter);
        builder
            .createEmbedding('999a6aa4-4412-4eaf-a99b-2842cb191e7c')
            .forReadModel(Chef)
            .resolveUpdateToEvents((receivedState, currentState, context) => {
                if (!currentState.name) {
                    return new ChefHired(receivedState.name);
                }
                throw new CouldNotResolveUpdateToEvents();
            })
            .resolveDeletionToEvents((currentState, context) => new ChefFired(currentState.name))
            .on<ChefHired>(ChefHired, (currentState, event, context) => {
                currentState.name = event.Chef;
                return currentState;
            })
            .on<ChefFired>(ChefFired, (currentState, event, context) => {
                return ProjectionResult.delete;
            });
    })
    .build();

(async () => {

    setTimeout(async () => {

        const tacoCounter = new DishCounter();
        tacoCounter.dish = 'Taco';
        tacoCounter.numberOfTimesPrepared = 5;

        const burritoCounter = new DishCounter();
        burritoCounter.dish = 'Burrito';
        burritoCounter.numberOfTimesPrepared = 3;

        const wrapCounter = new DishCounter();
        wrapCounter.dish = 'Wrap';
        wrapCounter.numberOfTimesPrepared = 2;

        await Promise.all([tacoCounter, burritoCounter, wrapCounter]
            .map(async counter => {
                console.log(`Updating dish: ${counter.dish}`);
                await client.embeddings
                    .forTenant(TenantId.development)
                    .update(DishCounter, counter.dish, counter);

                const counterState = await client.embeddings
                    .forTenant(TenantId.development)
                    .get(DishCounter, counter.dish);
                console.log('Got dish:', counterState.state);

                console.log(`Removed dish counter: ${counter}`);
                await client.embeddings
                    .forTenant(TenantId.development)
                    .delete(DishCounter, counter.dish);

                const deletedCounter = await client.embeddings
                    .forTenant(TenantId.development)
                    .get(DishCounter, counter.dish);
                console.log(`Got a removed, initial dish counter: ${JSON.stringify(deletedCounter.state)}`);
            }));

        const allDishCounters = await client.embeddings
            .forTenant(TenantId.development)
            .getAll(DishCounter);
        console.log(`Got all dishes:\n${[...allDishCounters].map(([key, value]) => `${key.value}: ${JSON.stringify(value.state, undefined, 2)}`).join('\n')}`);

        const dishCounterKeys = await client.embeddings
            .forTenant(TenantId.development)
            .getKeys(DishCounter);
        console.log(`Got all keys: ${dishCounterKeys}`);

        console.log('Hiring chefs!');
        const mrTaco = new Chef('Mr. Taco');
        const mrsTexMex = new Chef('Mrs. TexMex');

        await client.embeddings
            .forTenant(TenantId.development)
            .update(mrTaco.name,  '999a6aa4-4412-4eaf-a99b-2842cb191e7c', mrTaco);
        await client.embeddings
            .forTenant(TenantId.development)
            .update(mrsTexMex.name, '999a6aa4-4412-4eaf-a99b-2842cb191e7c', mrsTexMex);

        console.log('Getting all chefs!');
        const allChefs = await client.embeddings
            .forTenant(TenantId.development)
            .getAll('999a6aa4-4412-4eaf-a99b-2842cb191e7c');
        console.log(`Got all chefs:\n${[...allChefs].map(([key, value]) => `${key.value}: ${JSON.stringify(value.state, undefined, 2)}`).join('\n')}`);

        console.log('Removing Mr. Taco!');
        await client.embeddings
            .forTenant(TenantId.development)
            .delete(mrTaco.name, '999a6aa4-4412-4eaf-a99b-2842cb191e7c');
        const allChefsAgain = await client.embeddings
            .forTenant(TenantId.development)
            .getAll('999a6aa4-4412-4eaf-a99b-2842cb191e7c');
        console.log(`Getting all chefs again:\n${[...allChefsAgain].map(([key, value]) => `${key.value}: ${JSON.stringify(value.state, undefined, 2)}`).join('\n')}`);

        console.log('Getting Mr. Taco');
        const getMrTaco = await client.embeddings
            .forTenant(TenantId.development)
            .get(mrTaco.name, '999a6aa4-4412-4eaf-a99b-2842cb191e7c');
        console.log('Got removed Mr. Taco:', getMrTaco.state);

    }, 1000);
})();

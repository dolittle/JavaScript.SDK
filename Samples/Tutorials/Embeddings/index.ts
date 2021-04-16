// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// Sample code for the tutorial at https://dolittle.io/docs/tutorials/projections/

import { Client } from '@dolittle/sdk';
import { TenantId } from '@dolittle/sdk.execution';
import { DishPrepared } from './DishPrepared';
import { DishHandler } from './DishHandler';
import { DishCounter } from './DishCounter';
import { Chef } from './Chef';

const client = Client
    .forMicroservice('f39b1f61-d360-4675-b859-53c05c87c0e6')
    .withEventTypes(eventTypes =>
        eventTypes.register(DishPrepared))
    .withEventHandlers(builder =>
        builder.register(DishHandler))
    .withEmbeddings(builder => {
        builder.register(DishCounter);
        builder.createEmbedding('0767bc04-bc03-40b8-a0be-5f6c6130f68b')
            .forReadModel(Chef)
            .compare((oldState, newState, embeddingContext) => {
                return oldState.dishes
                    .filter((dish: string) => !newState.dishes.includes(dish))
                    .map((missingDish: string) => new DishPrepared(missingDish, 'default chef lol'))
            })
            .deleteMethod((currentState, embeddingContext) => {
                return new ChefFired(currentState.name);
            })
            .on(DishPrepared, _ => _.keyFromProperty('Chef'), (chef, event, projectionContext) => {
                chef.name = event.Chef;
                if (!chef.dishes.includes(event.Dish)) chef.dishes.push(event.Dish);
                return chef;
            });
    .build();

(async () => {
    const eventStore = client.eventStore.forTenant(TenantId.development);

    await eventStore.commit(new DishPrepared('Bean Blaster Taco', 'Mr. Taco'), 'bfe6f6e4-ada2-4344-8a3b-65a3e1fe16e9');
    await eventStore.commit(new DishPrepared('Bean Blaster Taco', 'Mrs. Tex Mex'), 'bfe6f6e4-ada2-4344-8a3b-65a3e1fe16e9');
    await eventStore.commit(new DishPrepared('Avocado Artillery Tortilla', 'Mr. Taco'), 'bfe6f6e4-ada2-4344-8a3b-65a3e1fe16e9');
    await eventStore.commit(new DishPrepared('Chili Canon Wrap', 'Mrs. Tex Mex'), 'bfe6f6e4-ada2-4344-8a3b-65a3e1fe16e9');

    setTimeout(async () => {
        for (const [dish, { state: counter }] of await client.projections.forTenant(TenantId.development).getAll(DishCounter)) {
            console.log(`The kitchen has prepared ${dish} ${counter.numberOfTimesPrepared} times`);
        }

        const chef = await client.projections.forTenant(TenantId.development).get<Chef>(Chef, 'Mrs. Tex Mex');
        console.log(`${chef.key} has prepared ${chef.state.dishes}`);
    }, 1000);
})();

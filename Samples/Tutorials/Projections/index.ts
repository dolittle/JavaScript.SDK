// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

// Sample code for the tutorial at https://dolittle.io/docs/tutorials/projections/

import { DolittleClient } from '@dolittle/sdk';
import { TenantId } from '@dolittle/sdk.execution';
import { DishPrepared } from './DishPrepared';
import { DishCounter } from './DishCounter';
import { Chef } from './Chef';

(async () => {
    const client = await DolittleClient
        .setup(builder => builder
            .withEventTypes(eventTypes =>
                eventTypes.register(DishPrepared))
            .withProjections(builder => {
                builder.register(DishCounter);

                builder.createProjection('0767bc04-bc03-40b8-a0be-5f6c6130f68b')
                    .forReadModel(Chef)
                    .on(DishPrepared, _ => _.keyFromProperty('Chef'), (chef, event, projectionContext) => {
                        chef.name = event.Chef;
                        if (!chef.dishes.includes(event.Dish)) chef.dishes.push(event.Dish);
                        return chef;
                    });
            }))
        .connect();

    const eventStore = client.eventStore.forTenant(TenantId.development);

    await eventStore.commit(new DishPrepared('Bean Blaster Taco', 'Mr. Taco'), 'Dolittle Tacos');
    await eventStore.commit(new DishPrepared('Bean Blaster Taco', 'Mrs. Tex Mex'), 'Dolittle Tacos');
    await eventStore.commit(new DishPrepared('Avocado Artillery Tortilla', 'Mr. Taco'), 'Dolittle Tacos');
    await eventStore.commit(new DishPrepared('Chili Canon Wrap', 'Mrs. Tex Mex'), 'Dolittle Tacos');

    setTimeout(async () => {
        for (const [dish, { state: counter }] of await client.projections.forTenant(TenantId.development).getAll(DishCounter)) {
            console.log(`The kitchen has prepared ${dish} ${counter.numberOfTimesPrepared} times`);
        }

        const chef = await client.projections.forTenant(TenantId.development).get<Chef>(Chef, 'Mrs. Tex Mex');
        console.log(`${chef.key} has prepared ${chef.state.dishes}`);
    }, 1000);
})();

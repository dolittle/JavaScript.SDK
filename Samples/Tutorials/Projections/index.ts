// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// Sample code for the tutorial at https://dolittle.io/tutorials/getting-started/typescript/

import { Client } from '@dolittle/sdk';
import { TenantId } from '@dolittle/sdk.execution';
import { ProjectionResult } from '@dolittle/sdk.projections';
import { Chef } from './Chef';
import { ChefFired } from './ChefFired';
import { DishPrepared } from './DishPrepared';

const client = Client
    .forMicroservice('f39b1f61-d360-4675-b859-53c05c87c0e6')
    .withEventTypes(eventTypes => {
        eventTypes.register(DishPrepared);
        eventTypes.register(ChefFired);
    })
    .withProjections(projections => {
        projections.createProjection('4a4c5b13-d4dd-4665-a9df-27b8e9b2054c')
            .forReadModel(Chef)
            .on(DishPrepared, _ => _.keyFromProperty('Chef'), (chef, event, ctx) => {
                console.log(`Handling event ${JSON.stringify(event)} and read model ${JSON.stringify(chef)}`);
                chef.name = event.Chef;
                chef.dishes.push(event.Dish);
                return chef;
            })
            .on(ChefFired, _ => _.keyFromProperty('Chef'), (chef, event, ctx) => {
                console.log(`Firing ${chef.name}`);
                return ProjectionResult.delete;
            })
        })
    .build();

const beanBlaster = new DishPrepared('Bean Blaster Taco', 'Mr. Taco');
const avocadoArtillery = new DishPrepared('Avocado Artillery Tortilla', 'Mr. Taco');
const chiliCannon = new DishPrepared('Chili Cannon Wrap', 'Ms. TexMex');
const mrTacoFired = new ChefFired('Mr. Taco');

(async () => {
    await client.eventStore
        .forTenant(TenantId.development)
        .commit(beanBlaster, 'bfe6f6e4-ada2-4344-8a3b-65a3e1fe16e9');
    await client.eventStore
        .forTenant(TenantId.development)
        .commit(avocadoArtillery, 'bfe6f6e4-ada2-4344-8a3b-65a3e1fe16e9');
    await client.eventStore
        .forTenant(TenantId.development)
        .commit(chiliCannon, 'bfe6f6e4-ada2-4344-8a3b-65a3e1fe16e9');

    await client.eventStore
        .forTenant(TenantId.development)
        .commit(mrTacoFired, 'bfe6f6e4-ada2-4344-8a3b-65a3e1fe16e9');
})();

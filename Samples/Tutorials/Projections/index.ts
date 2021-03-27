// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// Sample code for the tutorial at https://dolittle.io/tutorials/getting-started/typescript/

import { Client } from '@dolittle/sdk';
import { TenantId } from '@dolittle/sdk.execution';
import { Chef } from './Chef';
import { DishPrepared } from './DishPrepared';

const client = Client
    .forMicroservice('f39b1f61-d360-4675-b859-53c05c87c0e6')
    .withEventTypes(eventTypes =>
        eventTypes.register(DishPrepared))
    .withProjections(projections => {
        projections.createProjection('4a4c5b13-d4dd-4665-a9df-27b8e9b2054c')
            .forReadModel(Chef)
            .on(DishPrepared, _ => _.keyFromProperty('Chef'), (chef, event, ctx) => {
                chef.dishes.push(event.Dish);
                return chef;
            });
        //    projections.createProjection('4a4c5b13-d4dd-4665-a9df-27b8e9b2054c')
        //         .forReadModel({ name: '', dishes: [] as string[] })
        //         .on(DishPrepared, _ => _.keyFromProperty('Chef'), (chef, event, ctx) => {
        //             chef.dishes.push(event.Dish);
        //             return chef;
        //         });
        })
    .build();

// client.projections.Get(Chef, 'Mr. Taco');
// // client.projections.Get({ chefName: '', dishes: [] }, 'Mr. Taco');
// // client.projections.Get(new Chef(), 'Mr. Taco');
// client.projections.Get('686eb643-27e8-4f3b-8036-1ce960ed1e6a', 'Mr. Taco');

const beanBlaster = new DishPrepared('Bean Blaster Taco', 'Mr. Taco');
const avocadoArtillery = new DishPrepared('Avocado Artillery Tortilla', 'Mr. Taco');
const chiliCannon = new DishPrepared('Chili Cannon Wrap', 'Ms. TexMex');

client.eventStore
    .forTenant(TenantId.development)
    .commit(beanBlaster, 'bfe6f6e4-ada2-4344-8a3b-65a3e1fe16e9');
client.eventStore
    .forTenant(TenantId.development)
    .commit(avocadoArtillery, 'bfe6f6e4-ada2-4344-8a3b-65a3e1fe16e9');
client.eventStore
    .forTenant(TenantId.development)
    .commit(chiliCannon, 'bfe6f6e4-ada2-4344-8a3b-65a3e1fe16e9');

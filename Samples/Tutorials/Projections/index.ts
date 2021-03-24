// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// Sample code for the tutorial at https://dolittle.io/tutorials/getting-started/typescript/

import { Client } from '@dolittle/sdk';
import { TenantId } from '@dolittle/sdk.execution';
import { Chefs } from './Chefs';
import { Chef } from './Chef';
import { DishPrepared } from './DishPrepared';

const client = Client
    .forMicroservice('f39b1f61-d360-4675-b859-53c05c87c0e6')
    .withEventTypes(eventTypes =>
        eventTypes.register(DishPrepared))
    .withProjections(projections => {
        projections.createProjection('4a4c5b13-d4dd-4665-a9df-27b8e9b2054c')
            .forReadModel(Chefs)
            .on<DishPrepared>(DishPrepared, (chefs, event, ctx) => {
                console.log(`Updating Chefs readmodel on event ${JSON.stringify(event)}`);
                const foundIndex = chefs.chefArray.findIndex((chef: Chef) => chef.name === event.Chef);
                if (foundIndex > 0) {
                    chefs.chefArray[foundIndex].dishes.push(event.Dish);
                }
                else {
                    chefs.chefArray.push(new Chef(event.Chef, [event.Dish]));
                }
                return chefs;
            });
    })
    .build();

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

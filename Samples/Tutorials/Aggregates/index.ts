// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// Sample code for the tutorial at https://dolittle.io/tutorials/aggregates/

import { Client } from '@dolittle/sdk';
import { TenantId } from '@dolittle/sdk.execution';
import { DishPrepared } from './DishPrepared';
import { DishHandler } from './DishHandler';
import { Kitchen } from './Kitchen';

(async () => {
    const client = Client
        .forMicroservice('f39b1f61-d360-4675-b859-53c05c87c0e6')
        .withEventTypes(eventTypes =>
            eventTypes.register(DishPrepared))
        .withEventHandlers(builder =>
            builder.register(DishHandler))
        .withAggregateRoots(aggregateRoots =>
            aggregateRoots.register(Kitchen))
        .build();

    await client
        .aggregateOf(Kitchen, 'Dolittle Tacos', _ => _.forTenant(TenantId.development))
        .perform(kitchen => kitchen.prepareDish('Bean Blaster Taco', 'Mr. Taco'));

    console.log('Done');
})();
setInterval(function () {
}, 1000 * 60 * 60);
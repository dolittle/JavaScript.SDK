// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

// Sample code for the tutorial at https://dolittle.io/tutorials/aggregates/

import { DolittleClient } from '@dolittle/sdk';
import { TenantId } from '@dolittle/sdk.execution';
import { DishPrepared } from './DishPrepared';
import { DishHandler } from './DishHandler';
import { Kitchen } from './Kitchen';

(async () => {
    const client = await DolittleClient
        .setup(builder => builder
            .withEventTypes(eventTypes =>
                eventTypes.register(DishPrepared))
            .withEventHandlers(builder =>
                builder.register(DishHandler))
            .withAggregateRoots(aggregateRoots =>
                aggregateRoots.register(Kitchen)))
        .connect();

    // TODO: aggregates
    // await client
    //     .aggregateOf(Kitchen, 'Dolittle Tacos', _ => _.forTenant(TenantId.development))
        // .perform(kitchen => kitchen.prepareDish('Bean Blaster Taco', 'Mr. Taco'));

    console.log('Done');
})();
setInterval(function () {
}, 1000 * 60 * 60);

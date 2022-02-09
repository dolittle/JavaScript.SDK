// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

// Sample code for the tutorial at https://dolittle.io/docs/tutorials/projections/

import { DolittleClient } from '@dolittle/sdk';
import { TenantId } from '@dolittle/sdk.execution';
import { setTimeout } from 'timers/promises';
import { DateTime } from 'luxon';

import { DishCounter } from './DishCounter';
import { DishPrepared } from './DishPrepared';

(async () => {
    const client = await DolittleClient
        .setup()
        .connect();

    const eventStore = client.eventStore.forTenant(TenantId.development);

    await eventStore.commit(new DishPrepared('Bean Blaster Taco', 'Mr. Taco'), 'Dolittle Tacos');
    await eventStore.commit(new DishPrepared('Bean Blaster Taco', 'Mrs. Tex Mex'), 'Dolittle Tacos');
    await eventStore.commit(new DishPrepared('Avocado Artillery Tortilla', 'Mr. Taco'), 'Dolittle Tacos');
    await eventStore.commit(new DishPrepared('Chili Canon Wrap', 'Mrs. Tex Mex'), 'Dolittle Tacos');

    await setTimeout(1000);

    const dishCounterCollection = client.resources.forTenant(TenantId.development).mongoDB.getDatabase().collection(DishCounter);

    for (const { name, numberOfTimesPrepared, lastPrepared } of await dishCounterCollection.find().toArray()) {
        client.logger.info(`The kitchen has prepared ${name} ${numberOfTimesPrepared} times. The last time was ${lastPrepared}`);
    }

    const dishesPreparedToday = await dishCounterCollection.find({ lastPrepared: { $gte: DateTime.utc().startOf('day').toJSDate(), $lte: DateTime.utc().endOf('day').toJSDate() }}).toArray();
    for (const { name } of await dishCounterCollection.find().toArray()) {
        client.logger.info(`The kitchen has prepared ${name} today`);
    }
})();

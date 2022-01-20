// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

// Sample code for the tutorial at https://dolittle.io/tutorials/aggregates/

import { DolittleClient } from '@dolittle/sdk';
import { TenantId } from '@dolittle/sdk.execution';

import  './DishHandler';
import { Kitchen } from './Kitchen';

(async () => {
    const client = await DolittleClient
        .setup()
        .connect();

    await client.aggregates
        .forTenant(TenantId.development)
        .get(Kitchen, 'Dolittle Tacos')
        .perform(kitchen => kitchen.prepareDish('Bean Blaster Taco', 'Mr. Taco'));
})();

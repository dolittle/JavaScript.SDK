// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

// Sample code for the tutorial at https://dolittle.io/tutorials/getting-started/typescript/

import { DolittleClient } from '@dolittle/sdk';
import { TenantId } from '@dolittle/sdk.execution';
import { DishPrepared } from './DishPrepared';
import './DishHandler';

(async () => {
    const client = await DolittleClient
        .setup()
        .connect();

    const preparedTaco = new DishPrepared('Bean Blaster Taco', 'Mr. Taco');

    await client.eventStore
        .forTenant(TenantId.development)
        .commit(preparedTaco, 'Dolittle Tacos');
})();

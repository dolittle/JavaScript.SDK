// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

// Sample code for the tutorial at https://dolittle.io/tutorials/event-horizon/

import { DolittleClient } from '@dolittle/sdk';
import { EventContext } from '@dolittle/sdk.events';
import { PartitionedFilterResult } from '@dolittle/sdk.events.filtering';
import { TenantId } from '@dolittle/sdk.execution';

import './DishHandler';
import { DishPrepared } from './DishPrepared';

(async () => {
    const client = await DolittleClient
        .setup(_ => _
            .withFilters(_ => _
                .createPublicFilter('2c087657-b318-40b1-ae92-a400de44e507', _ => _
                    .handle((event: any, context: EventContext) => {
                        client.logger.info(`Filtering event ${JSON.stringify(event)} to public stream`);
                        return new PartitionedFilterResult(true, 'Dolittle Tacos');
                    })
                )))
        .connect();

    const preparedTaco = new DishPrepared('Bean Blaster Taco', 'Mr. Taco');

    await client.eventStore
        .forTenant(TenantId.development)
        .commitPublic(preparedTaco, 'Dolittle Tacos');
})();

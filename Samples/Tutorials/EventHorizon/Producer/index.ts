// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// Sample code for the tutorial at https://dolittle.io/tutorials/event-horizon/

import { Client } from '@dolittle/sdk';
import { EventContext, PartitionId } from '@dolittle/sdk.events';
import { PartitionedFilterResult } from '@dolittle/sdk.events.filtering';
import { TenantId } from '@dolittle/sdk.execution';
import { DishPrepared } from './DishPrepared';
import { DishHandler } from './DishHandler';

const client = Client
    .forMicroservice('f39b1f61-d360-4675-b859-53c05c87c0e6')
    .withEventTypes(eventTypes =>
        eventTypes.register(DishPrepared))
    .withEventHandlers(builder =>
        builder.register(DishHandler))
    .withFilters(filterBuilder =>
        filterBuilder
            .createPublicFilter('2c087657-b318-40b1-ae92-a400de44e507', fb =>
                fb.handle((event: any, context: EventContext) => {
                    console.log(`Filtering event ${JSON.stringify(event)} to public stream`);
                    return new PartitionedFilterResult(true, PartitionId.unspecified);
                })
            ))
    .build();

const preparedTaco = new DishPrepared('Bean Blaster Taco', 'Mr. Taco');

client.eventStore
    .forTenant(TenantId.development)
    .commitPublic(preparedTaco, 'bfe6f6e4-ada2-4344-8a3b-65a3e1fe16e9');

// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// Sample code for the tutorial at https://dolittle.io/tutorials/event-horizon/

import { Client } from '@dolittle/sdk';
import { PartitionId } from '@dolittle/sdk.events';
import { TenantId } from '@dolittle/sdk.execution';
import { DishPrepared } from './DishPrepared';

const client = Client
    .forMicroservice('a14bb24e-51f3-4d83-9eba-44c4cffe6bb9')
    .withRuntimeOn('localhost', 50055)
    .withEventTypes(eventTypes =>
        eventTypes.register(DishPrepared))
    .withEventHorizons(_ => {
        _.forTenant(TenantId.development, ts =>
            ts.fromProducerMicroservice('f39b1f61-d360-4675-b859-53c05c87c0e6')
                .fromProducerTenant(TenantId.development)
                .fromProducerStream('2c087657-b318-40b1-ae92-a400de44e507')
                .fromProducerPartition(PartitionId.unspecified.value)
                .toScope('808ddde4-c937-4f5c-9dc2-140580f6919e'));
    })
    .withEventHandlers(eventHandlers =>
        eventHandlers
            .createEventHandler('6c3d358f-3ecc-4c92-a91e-5fc34cacf27e', _ =>
                _.inScope('808ddde4-c937-4f5c-9dc2-140580f6919e')
                    .partitioned()
                    .handle(DishPrepared, (event, context) => console.log(`Handled event ${JSON.stringify(event)} from public stream`))))
    .build();

// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

// Sample code for the tutorial at https://dolittle.io/tutorials/event-horizon/

import { DolittleClient } from '@dolittle/sdk';
import { TenantId } from '@dolittle/sdk.execution';

import { DishPrepared } from './DishPrepared';

(async () => {
    const client = await DolittleClient
        .setup(_ => _
            .withEventHorizons(_ => {
                _.forTenant(TenantId.development, _ => _
                    .fromProducerMicroservice('f39b1f61-d360-4675-b859-53c05c87c0e6')
                        .fromProducerTenant(TenantId.development)
                        .fromProducerStream('2c087657-b318-40b1-ae92-a400de44e507')
                        .fromProducerPartition('Dolittle Tacos')
                        .toScope('808ddde4-c937-4f5c-9dc2-140580f6919e'));
            })
            .withEventHandlers(_ => _
                .create('6c3d358f-3ecc-4c92-a91e-5fc34cacf27e')
                    .inScope('808ddde4-c937-4f5c-9dc2-140580f6919e')
                    .partitioned()
                    .handle(DishPrepared, (event, context) => {
                        client.logger.info(`Handled event ${JSON.stringify(event)} from public stream`);
                     })
            )
        )
        .connect(_ => _
            .withRuntimeOn('localhost', 50055)
        );
})();

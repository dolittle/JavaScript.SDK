// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Client } from '@dolittle/sdk';
import { EventContext } from '@dolittle/sdk.events';

import './MyEventHandler';

const client = Client
    .for('a14bb24e-51f3-4d83-9eba-44c4cffe6bb9')
    .connectTo('localhost', 50055)
    .configureLogging(_ => _.level = 'debug')
    .withEventHorizons(_ => {
        _.forTenant('900893e7-c4cc-4873-8032-884e965e4b97', ts => {
            ts.forMicroservice('7a6155dd-9109-4488-8f6f-c57fe4b65bfb', sb => {
                sb
                    .fromTenant('900893e7-c4cc-4873-8032-884e965e4b97')
                    .forStream('2c087657-b318-40b1-ae92-a400de44e507')
                    .toScope('406d6473-7cc9-44a6-a55f-775c1021d957')
                    .onSuccess((t, s, sr) => console.log('Subscription: Success'))
                    .onFailure((t, s, sr) => console.log(`Subscription: Failed - ${sr.failure?.reason}`))
                    .onCompleted((t, s, sr) => console.log(`Subscription: Completed`));
            })
                .onSuccess((t, s, sr) => console.log('Tenant: Success'))
                .onFailure((t, s, sr) => console.log(`Tenant: Failed - ${sr.failure?.reason}`))
                .onCompleted((t, s, sr) => console.log(`Tenant: Completed`));
        })
        .onSuccess((t, s, sr) => console.log('EventHorizons: Success'))
        .onFailure((t, s, sr) => console.log(`EventHorizons: Failed - ${sr.failure?.reason}`))
        .onCompleted((t, s, sr) => console.log(`EventHorizons: Completed`));
    })
    .build();

client.executionContextManager.currentFor('900893e7-c4cc-4873-8032-884e965e4b97');

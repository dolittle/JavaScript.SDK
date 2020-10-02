// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Client } from '@dolittle/sdk';

import { MyEventHandler } from './MyEventHandler';
import { MyEvent } from './MyEvent';
import { PartitionId } from '@dolittle/sdk.events';

const client = Client
    .create()
    .forMicroservice('a14bb24e-51f3-4d83-9eba-44c4cffe6bb9')
    .connectToRuntime('localhost', 50055)
    .withLogging(_ => _.useWinston(_ => _.level = 'debug'))
    .withEventTypes(eventTypes =>
        eventTypes.register(MyEvent))
    .withEventHandlers(eventHandlers =>
        eventHandlers.register(MyEventHandler))
    .withEventHorizons(_ => {
        _.forTenant('900893e7-c4cc-4873-8032-884e965e4b97', ts => {
            ts.fromProducerMicroservice('7a6155dd-9109-4488-8f6f-c57fe4b65bfb')
                .fromProducerTenant('900893e7-c4cc-4873-8032-884e965e4b97')
                .fromProducerStream('2c087657-b318-40b1-ae92-a400de44e507')
                .fromProducerPartition(PartitionId.unspecified.value)
                .toScope('406d6473-7cc9-44a6-a55f-775c1021d957')
                .onSuccess((t, s, sr) => console.log('Subscription: Success'))
                .onFailure((t, s, sr) => console.log(`Subscription: Failed - ${sr.failure?.reason}`))
                .onCompleted((t, s, sr) => console.log(`Subscription: Completed`));
            ts.onSuccess((t, s, sr) => console.log('Tenant: Success'));
            ts.onFailure((t, s, sr) => console.log(`Tenant: Failed - ${sr.failure?.reason}`));
            ts.onCompleted((t, s, sr) => console.log(`Tenant: Completed`));
            })
        .onSuccess((t, s, sr) => console.log('EventHorizons: Success'))
        .onFailure((t, s, sr) => console.log(`EventHorizons: Failed - ${sr.failure?.reason}`))
        .onCompleted((t, s, sr) => console.log(`EventHorizons: Completed`));
    })
    .build();

const event = new MyEvent();
event.anInteger = 42;
event.aString = 'Forty two';

client
    .eventStore
    .forTenant('900893e7-c4cc-4873-8032-884e965e4b97')
    .commitPublic(event, 'd8cb7301-4bec-4451-a72b-2db53c6dc05d');

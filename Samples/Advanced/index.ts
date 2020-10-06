// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Client } from '@dolittle/sdk';
import { EventContext, PartitionId } from '@dolittle/sdk.events';
import { PartitionedFilterResult } from '@dolittle/sdk.events.filtering';

import { MyEvent } from './MyEvent';
import { MyEventHandler } from './MyEventHandler';

const client = Client
    .forMicroservice('7a6155dd-9109-4488-8f6f-c57fe4b65bfb')
    .withVersion(1, 0, 2)
    .withEnvironment('test')
    .withEventTypes(eventTypes =>
        eventTypes.register(MyEvent))
    .withEventHandlers(eventHandlers =>
        eventHandlers
            .register(MyEventHandler))
    .withFilters(filterBuilder =>
        filterBuilder
            .createPrivateFilter('79e12ab3-2751-47e1-b959-d898dc4d6ee8', fb =>
                fb
                    .unpartitioned()
                    .handle((event: any, context: EventContext) => {
                        return new Promise((resolve, reject) => {
                            console.log('Filtering event', event);
                        });
                })
            )
            .createPublicFilter('2c087657-b318-40b1-ae92-a400de44e507', fb =>
                fb.handle((event: any, context: EventContext) => {
                    return new PartitionedFilterResult(true, PartitionId.unspecified);
                })
            )
    )
    .build();


const event = new MyEvent();
event.anInteger = 42;
event.aString = 'Forty two';

client
    .eventStore
    .forTenant('900893e7-c4cc-4873-8032-884e965e4b97')
    .commitPublic(event, 'd8cb7301-4bec-4451-a72b-2db53c6dc05d');

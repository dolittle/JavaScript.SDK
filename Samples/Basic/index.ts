// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { Client } from '@dolittle/sdk';
import { EventContext } from '@dolittle/sdk.events';
import { PartitionedFilterResult } from '@dolittle/sdk.events.filtering';

import { MyEvent } from './MyEvent';
import './MyEventHandler';

const client = Client
    .for('7a6155dd-9109-4488-8f6f-c57fe4b65bfb')
    .configureLogging(_ => _.level = 'debug')
    // .withEventHandlers(_ => {
    //     _.for('a0be3ef0-113f-45a6-800e-061d375407c2', ehb => {
    //         ehb.handle(MyEvent, async (myEvent: MyEvent, context: EventContext) => {
    //             return new Promise((resolve) => {
    //                 console.log('Start processing', myEvent);
    //                 setTimeout(() => {
    //                     console.log('Done processing', myEvent);
    //                     resolve();
    //                 }, 2000);
    //             });
    //         });
    //     });
    // })
    .withFilters(_ => {
        _.for('79e12ab3-2751-47e1-b959-d898dc4d6ee8', fb => {
            fb
                .private()
                .handle((event: any, context: EventContext) => {
                    return new Promise((resolve, reject) => {
                        console.log('Filtering event', event);
                    });
                });
            });
        _.for('2c087657-b318-40b1-ae92-a400de44e507', fb => {
            fb
                .public()
                .handle((event: any, context: EventContext) => {
                    return new PartitionedFilterResult(true, Guid.empty);
                });
        });
    })
    .build();


client.executionContextManager.currentFor('900893e7-c4cc-4873-8032-884e965e4b97');

const event = new MyEvent();
event.anInteger = 42;
event.aString = 'Forty two';
// client.eventStore.commit(event, 'd8cb7301-4bec-4451-a72b-2db53c6dc05d');
// client.eventStore.commit(event, 'd8cb7301-4bec-4451-a72b-2db53c6dc05d');
// client.eventStore.commit(event, 'd8cb7301-4bec-4451-a72b-2db53c6dc05d');

client.eventStore.commitPublic(event, 'd8cb7301-4bec-4451-a72b-2db53c6dc05d');
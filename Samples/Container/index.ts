// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import 'reflect-metadata';
import { DolittleClient } from '@dolittle/sdk';
import { Container } from 'typedi';

import { MyEvent } from './MyEvent';
import { MyEventHandler } from './MyEventHandler';

const client = DolittleClient
    .forMicroservice('7a6155dd-9109-4488-8f6f-c57fe4b65bfb')
    .withContainer(Container)
    .withEventTypes(eventTypes =>
        eventTypes.register(MyEvent))
    .withEventHandlers(eventHandlers =>
        eventHandlers.register(MyEventHandler))
    .build();

const event = new MyEvent();
event.anInteger = 42;
event.aString = 'Forty two';
client
    .eventStore
    .forTenant('900893e7-c4cc-4873-8032-884e965e4b97')
    .commit(event, 'd8cb7301-4bec-4451-a72b-2db53c6dc05d');

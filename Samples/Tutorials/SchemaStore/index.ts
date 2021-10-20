// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// Sample code for the tutorial at https://dolittle.io/docs/tutorials/projections/

import { Client } from '@dolittle/sdk';
import { DishCreated } from './EventTypes/DishCreated';

const client = Client
    .forMicroservice('f39b1f61-d360-4675-b859-53c05c87c0e6')
    .withEventTypes(eventTypes =>
        eventTypes.registerForSchema(DishCreated))
    // .withEventHandlers(builder =>
    //     builder.register(DishHandler))
    .build();

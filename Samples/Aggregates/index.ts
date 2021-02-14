// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// Sample code for the tutorial at https://dolittle.io/tutorials/getting-started/typescript/

import { Client } from '@dolittle/sdk';
import { TenantId } from '@dolittle/sdk.execution';
import { DishPrepared } from './DishPrepared';
import { DishHandler } from './DishHandler';
import { Kitchen } from './Kitchen';

const client = Client
    .forMicroservice('f39b1f61-d360-4675-b859-53c05c87c0e6')
    .withEventTypes(eventTypes =>
        eventTypes.register(DishPrepared))
    .withEventHandlers(builder =>
        builder.register(DishHandler))
    .build();

client
    .aggregateOf(Kitchen,'bfe6f6e4-ada2-4344-8a3b-65a3e1fe16e9',_  => _.forTenant(TenantId.development))
    .perform(kitchen => kitchen.prepareDish('Bean Blaster Taco', 'Mr. Taco'));


// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

// Sample code for the tutorial at https://dolittle.io/docs/tutorials/embeddings/

import { DolittleClient } from '@dolittle/sdk';
import { TenantId } from '@dolittle/sdk.execution';
import { setTimeout } from 'timers/promises';

import { Employee } from './Employee';

(async () => {
    const client = await DolittleClient
        .setup()
        .connect();

    // wait for the registration to complete
    await setTimeout(1000);

    // mock of the state from the external HR system
    const updatedEmployee = new Employee(
        'Mr. Taco',
        'Street Food Taco Truck');

    await client.embeddings
        .forTenant(TenantId.development)
        .update(Employee, updatedEmployee.name, updatedEmployee);
    console.log(`Updated ${updatedEmployee.name}`);

    const mrTaco = await client.embeddings
        .forTenant(TenantId.development)
        .get(Employee, 'Mr. Taco');
    console.log(`Mr. Taco is now working at ${mrTaco.state.workplace}`);

    const allEmployeeNames = await client.embeddings
        .forTenant(TenantId.development)
        .getKeys(Employee);
    console.log(`All current employees are ${allEmployeeNames}`);

    await client.embeddings
        .forTenant(TenantId.development)
        .delete(Employee, updatedEmployee.name);
    console.log(`Deleted ${updatedEmployee.name}`);
})();

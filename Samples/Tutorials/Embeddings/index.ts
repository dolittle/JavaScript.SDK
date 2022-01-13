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

    await setTimeout(2000);

    const updatedEmployee = new Employee(
        'Mr. Taco',
        'Street Food Taco Truck');

    await client.embeddings
        .forTenant(TenantId.development)
        .update(Employee, updatedEmployee.name, updatedEmployee);
    client.logger.info(`Updated ${updatedEmployee.name}`);

    const mrTaco = await client.embeddings
        .forTenant(TenantId.development)
        .get(Employee, 'Mr. Taco');
    client.logger.info(`Mr. Taco is now working at ${mrTaco.state.workplace}`);

    const allEmployeeNames = await client.embeddings
        .forTenant(TenantId.development)
        .getKeys(Employee);
    client.logger.info(`All current employees are ${allEmployeeNames}`);

    await client.embeddings
        .forTenant(TenantId.development)
        .delete(Employee, updatedEmployee.name);
    client.logger.info(`Deleted ${updatedEmployee.name}`);
})();

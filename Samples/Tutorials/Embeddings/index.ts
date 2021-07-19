// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// Sample code for the tutorial at https://dolittle.io/docs/tutorials/embeddings/

import { Client } from '@dolittle/sdk';
import { TenantId } from '@dolittle/sdk.execution';
import { Employee } from './Employee';
import { EmployeeHired } from './EmployeeHired';
import { EmployeeRetired } from './EmployeeRetired';
import { EmployeeTransferred } from './EmployeeTransferred';

const client = Client
    .forMicroservice('f39b1f61-d360-4675-b859-53c05c87c0e6')
    .withEventTypes(eventTypes => {
        eventTypes.register(EmployeeHired);
        eventTypes.register(EmployeeTransferred);
        eventTypes.register(EmployeeRetired);
    })
    .withEmbeddings(builder => {
        builder.register(Employee);
    })
    .build();

(async () => {

    setTimeout(async () => {
        // mock of the state from the external HR system
        const updatedEmployee = new Employee(
            'Mr. Taco',
            'Street Food Taco Truck');

        await client.embeddings
            .forTenant(TenantId.development)
            .update(Employee, updatedEmployee.name, updatedEmployee);
        console.log(`Updated ${updatedEmployee.name}`);

        await client.embeddings
            .forTenant(TenantId.development)
            .delete(Employee, updatedEmployee.name);
        console.log(`Deleted ${updatedEmployee.name}`);
    }, 1000);
})();

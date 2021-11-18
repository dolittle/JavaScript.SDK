// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

// Sample code for the tutorial at https://dolittle.io/tutorials/embeddings/

import { CouldNotResolveUpdateToEvents, embedding, EmbeddingContext, EmbeddingProjectContext, on, resolveDeletionToEvents, resolveUpdateToEvents } from '@dolittle/sdk.embeddings';
import { ProjectionResult } from '@dolittle/sdk.projections';
import { EmployeeHired } from './EmployeeHired';
import { EmployeeRetired } from './EmployeeRetired';
import { EmployeeTransferred } from './EmployeeTransferred';

@embedding('e5577d2c-0de7-481c-b5be-6ef613c2fcd6')
export class Employee {

    constructor(
        public name: string = '',
        public workplace: string = 'Unassigned') {
    }

    @resolveUpdateToEvents()
    resolveUpdateToEvents(updatedEmployee: Employee, context: EmbeddingContext) {
        if (this.name !== updatedEmployee.name) {
            return new EmployeeHired(updatedEmployee.name);
        } else if (this.workplace !== updatedEmployee.workplace) {
            return new EmployeeTransferred(this.name, this.workplace, updatedEmployee.workplace);
        }

        throw new CouldNotResolveUpdateToEvents();
    }

    @resolveDeletionToEvents()
    resolveDeletionToEvents(context: EmbeddingContext) {
        return new EmployeeRetired(this.name);
    }

    @on(EmployeeHired)
    onEmployeeHired(event: EmployeeHired, context: EmbeddingProjectContext) {
        this.name = event.name;
    }

    @on(EmployeeTransferred)
    onEmployeeTransferred(event: EmployeeTransferred, context: EmbeddingProjectContext) {
        this.workplace = event.to;
    }

    @on(EmployeeRetired)
    onEmployeeRetired(event: EmployeeRetired, context: EmbeddingProjectContext) {
        return ProjectionResult.delete;
    }
}

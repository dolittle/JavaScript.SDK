// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

// Sample code for the tutorial at https://dolittle.io/tutorials/embeddings/

import { eventType } from '@dolittle/sdk.events';

@eventType('1932beb4-c8cd-4fee-9a7e-a92af3693510')
export class EmployeeRetired {
    constructor(readonly name: string) {}
}

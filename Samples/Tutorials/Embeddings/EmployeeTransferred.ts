// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// Sample code for the tutorial at https://dolittle.io/tutorials/embeddings/

import { eventType } from '@dolittle/sdk.events';

@eventType('b27f2a39-a2d4-43a7-9952-62e39cbc7ebc')
export class EmployeeTransferred {
    constructor(readonly name: string, readonly from: string, readonly to: string) {}
}

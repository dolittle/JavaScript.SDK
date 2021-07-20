// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// Sample code for the tutorial at https://dolittle.io/tutorials/embeddings/

import { eventType } from '@dolittle/sdk.events';

@eventType('8fdf45bc-f484-4348-bcb0-4d6f134aaf6c')
export class EmployeeHired {
    constructor(readonly name: string) {}
}

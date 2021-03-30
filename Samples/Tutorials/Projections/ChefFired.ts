// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// Sample code for the tutorial at https://dolittle.io/tutorials/getting-started/projections/

import { eventType } from '@dolittle/sdk.events';

@eventType('b3a31696-4cfd-4225-8b7e-72d1c02d93d5')
export class ChefFired {
    constructor(readonly Chef: string) {}
}

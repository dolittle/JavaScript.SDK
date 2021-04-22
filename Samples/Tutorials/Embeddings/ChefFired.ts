// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// Sample code for the tutorial at https://dolittle.io/tutorials/projections/typescript/

import { eventType } from '@dolittle/sdk.events';

@eventType('d3db6f3c-eee5-4b8a-9c6b-c9cd71e545ed')
export class ChefFired {
    constructor(readonly Chef: string) {}
}

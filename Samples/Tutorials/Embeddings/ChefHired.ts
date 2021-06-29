// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// Sample code for the tutorial at https://dolittle.io/tutorials/embeddings/

import { eventType } from '@dolittle/sdk.events';

@eventType('a7a499a8-816f-4bc5-96cc-a44a6f5d1b04')
export class ChefHired {
    constructor(readonly Chef: string) {}
}

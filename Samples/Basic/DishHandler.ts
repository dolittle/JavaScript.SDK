// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// Sample code for the tutorial at https://dolittle.io/tutorial/getting-started/typescript/

import { EventContext } from '@dolittle/sdk.events';
import { eventHandler, handles } from '@dolittle/sdk.events.handling';
import { DishPrepared } from './DishPrepared';

@eventHandler('f2d366cf-c00a-4479-acc4-851e04b6fbba')
export class DishHandler {

    @handles(DishPrepared)
    DishPrepared(event: DishPrepared, eventContext: EventContext) {
        console.log(`${event.chef} has prepared ${event.dish}. Yummm!`);
    }
}

// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

// Sample code for the tutorial at https://dolittle.io/tutorials/aggregates/

import { inject } from '@dolittle/sdk.dependencyinversion';
import { EventContext } from '@dolittle/sdk.events';
import { eventHandler, handles } from '@dolittle/sdk.events.handling';
import { Logger } from 'winston';

import { DishPrepared } from './DishPrepared';

@eventHandler('f2d366cf-c00a-4479-acc4-851e04b6fbba')
export class DishHandler {
    constructor(
        @inject('Logger') private readonly _logger: Logger
    ) {}

    @handles(DishPrepared)
    async dishPrepared(event: DishPrepared, eventContext: EventContext) {
        this._logger.info(`${event.Chef} has prepared ${event.Dish}. Yummm!`);
    }
}

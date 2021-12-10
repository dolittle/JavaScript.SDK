// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

// Sample code for the tutorial at https://dolittle.io/tutorials/getting-started/typescript/

import { Logger } from 'winston';
import { inject } from '@dolittle/sdk.common';
import { EventContext, IEventStore } from '@dolittle/sdk.events';
import { eventHandler, handles } from '@dolittle/sdk.events.handling';
import { DishPrepared } from './DishPrepared';

@eventHandler('f2d366cf-c00a-4479-acc4-851e04b6fbba')
@inject('logger', IEventStore)
export class DishHandler {

    constructor(
        // @inject('logger') private readonly _logger: Logger,
        // @inject(IEventStore) private readonly _eventStore: IEventStore,
        private readonly _logger: Logger,
        private readonly _eventStore: IEventStore,
    ) {}

    @handles(DishPrepared)
    async dishPrepared(event: DishPrepared, eventContext: EventContext) {
        console.log(`${event.Chef} has prepared ${event.Dish}. Yummm!`);
        this._logger.info('Hello nice message from the eventhandler');

        await new Promise<void>((resolve) => {
            setTimeout(async () => {
                await this._eventStore.commit(new DishPrepared('EventHandlerChef', 'RecursiveDish'), 'Dakitchen');
                resolve();
            }, 1000);
        });

        this._logger.info('Committed new event');
    }
}

// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { EventContext } from '@dolittle/sdk.events';
import { eventHandler, handles } from '@dolittle/sdk.events.handling';
import { inject } from 'inversify';
import { Logger } from 'winston';

import { MyEvent } from './MyEvent';
import { MyService } from './MyService';
import { MyTenantScopedService } from './MyTenantScopedService';

@eventHandler('a27074a7-5b01-43c9-b4f0-c1d59668d844')
export class MyEventHandler {
    constructor(
        @inject(MyService) private readonly _myService: MyService,
        @inject(MyTenantScopedService) private readonly _myTenantScopedService: MyTenantScopedService,
        @inject('Logger') private readonly _logger: Logger
    ) {}

    @handles(MyEvent)
    myEvent(event: MyEvent, context: EventContext) {
        this._logger.info('Handling event', event, event instanceof MyEvent);
        this._myService.doStuff();
        this._myTenantScopedService.doStuff();
    }
}

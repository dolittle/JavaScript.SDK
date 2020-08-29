// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
import { EventContext } from '@dolittle/sdk.events';
import { eventHandler, handles, inScope } from '@dolittle/sdk.events.handling';
import { MyEvent } from './MyEvent';


@eventHandler('62f7d968-9e70-47a6-9bb7-b21e1b3ed71c')
@inScope('406d6473-7cc9-44a6-a55f-775c1021d957')
export class MyEventHandler {

    @handles(MyEvent)
    myEvent(event: MyEvent, context: EventContext) {
        console.log('Handling event', event, event instanceof MyEvent);
    }
}

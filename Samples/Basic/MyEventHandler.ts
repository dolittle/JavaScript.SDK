// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
import { EventContext } from '@dolittle/sdk.events';
import { eventHandler, handles } from '@dolittle/sdk.events.handling';
import { MyEvent } from './MyEvent';


@eventHandler('a27074a7-5b01-43c9-b4f0-c1d59668d844', { inScope: '406d6473-7cc9-44a6-a55f-775c1021d957' })
export class MyEventHandler {

    @handles(MyEvent)
    myEvent(event: MyEvent, context: EventContext) {
        console.log('Handling event', event, event instanceof MyEvent);
    }
}

import { EventContext } from '@dolittle/sdk.events';
import { eventHandler, handles } from '@dolittle/sdk.events.handling';
import { MyEvent } from './MyEvent';


@eventHandler('a27074a7-5b01-43c9-b4f0-c1d59668d844')
export class MyEventHandler {

    @handles(MyEvent)
    myEvent(event: MyEvent, context: EventContext) {
        console.log('Handling event', event, event instanceof MyEvent);
    }
}

import { event, EventContext } from '@dolittle/sdk.events';
import { eventHandler } from '@dolittle/sdk.events.handling';
import { MyEvent } from './MyEvent';


@eventHandler('a27074a7-5b01-43c9-b4f0-c1d59668d841')
export class MyEventHandler {

    @event(MyEvent)
    handle(event: MyEvent, context: EventContext) {
        console.log('Handling event');
    }
}

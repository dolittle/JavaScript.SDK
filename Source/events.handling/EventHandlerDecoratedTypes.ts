// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ReplaySubject } from 'rxjs';
import { EventHandlerDecoratedType } from 'EventHandlerDecoratedType';
import { EventHandlerId } from './EventHandlerId';

export class EventHandlerDecoratedTypes {
    static readonly types: ReplaySubject<EventHandlerDecoratedType> = new ReplaySubject<EventHandlerDecoratedType>();

    static register(eventHandlerId: EventHandlerId, type: Function) {
        this.types.next(new EventHandlerDecoratedType(eventHandlerId, type));
    }
}

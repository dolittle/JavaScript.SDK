// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ReplaySubject } from 'rxjs';

import { EventHandlerDecoratedType } from './EventHandlerDecoratedType';

/**
 * Handles registering and mappings between @eventHandler decorated classes and their given id and options.
 */
export class EventHandlerDecoratedTypes {
    static readonly types: ReplaySubject<EventHandlerDecoratedType> = new ReplaySubject<EventHandlerDecoratedType>();

    /**
     * Registers an decorated event handler class with the Runtime.
     * @param {EventHandlerDecoratedType} eventHandlerDecoratedType The decorated type to register.
     */
    static register(eventHandlerDecoratedType: EventHandlerDecoratedType) {
        this.types.next(eventHandlerDecoratedType);
    }
}

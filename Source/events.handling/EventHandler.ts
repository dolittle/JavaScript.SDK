// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { EventHandlerId } from './EventHandlerId';
import { EventHandlerMethod } from './EventHandlerMethod';
import { EventHandlerDecoratedTypes } from './EventHandlerDecoratedTypes';

export type EventHandlerProvider = () => any;

export class EventHandler {
    constructor(readonly eventHandlerId: EventHandlerId, readonly eventHandlerProvider: EventHandlerProvider, readonly methods: EventHandlerMethod[]) {
    }
}

export function eventHandler(eventHandlerId: EventHandlerId) {
    return function (target: any) {
        EventHandlerDecoratedTypes.register(eventHandlerId, target.constructor);
    };
}

// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';

import { EventHandlerDecoratedTypes } from './EventHandlerDecoratedTypes';
import { IEventHandler } from './IEventHandler';

export class EventHandlerClassBuilder<T> {
    constructor(private readonly _eventHandlerType: Constructor<T>, private readonly _instance?: T) {
    }

    tryBuild(): [IEventHandler, boolean] {
        let eventHandler: IEventHandler;
        const decoratedType = EventHandlerDecoratedTypes.types.find(_ => _.type === this._eventHandlerType);
        if (decoratedType !== null) {
        }
        return [eventHandler, true];
    }
}
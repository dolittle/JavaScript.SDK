// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';
import { EventHandlerId } from './index';

export class EventHandlerIdAlreadyInUse extends Exception {
    constructor(eventHandlerId: EventHandlerId, type: Function, alreadyUsedType: Function) {
        super(`EventHandlerId '${eventHandlerId}' in EventHandler '${type.name}' is already in use in type '${alreadyUsedType.name}'`);
    }
}

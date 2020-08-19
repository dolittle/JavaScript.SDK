// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ReplaySubject } from 'rxjs';
import { ScopeId } from '@dolittle/sdk.events';

import { EventHandlerDecoratedType } from './EventHandlerDecoratedType';
import { EventHandlerId } from './EventHandlerId';

export class EventHandlerDecoratedTypes {
    static readonly types: ReplaySubject<EventHandlerDecoratedType> = new ReplaySubject<EventHandlerDecoratedType>();

    static register(eventHandlerId: EventHandlerId, scopeId: ScopeId | undefined, type: Function) {
        this.types.next(new EventHandlerDecoratedType(eventHandlerId, scopeId, type));
    }
}

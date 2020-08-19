// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ScopeId } from '@dolittle/sdk.events';

import { EventHandlerId } from './EventHandlerId';

export class EventHandlerDecoratedType {
    constructor(readonly eventHandlerId: EventHandlerId, readonly scopeId: ScopeId | undefined, readonly type: Function) {
    }
}

// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ScopeId } from '@dolittle/sdk.events';
import { Constructor } from '@dolittle/types';

import { EventHandlerAlias, EventHandlerId } from '..';

/**
 * Represents an event handler created from the decorator
 */
export class EventHandlerDecoratedType {
    constructor(
        readonly eventHandlerId: EventHandlerId,
        readonly scopeId: ScopeId,
        readonly partitioned: boolean,
        readonly alias: EventHandlerAlias,
        readonly type: Constructor<any>) {
    }
}

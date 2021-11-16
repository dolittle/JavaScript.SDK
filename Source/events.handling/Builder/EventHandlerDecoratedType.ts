// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ScopeId } from '@dolittle/sdk.events';
import { Constructor } from '@dolittle/types';

import { EventHandlerAlias, EventHandlerId } from '../index';

/**
 * Represents an event handler created from the decorator.
 */
export class EventHandlerDecoratedType {
    /**
     * Initialises a new instance of the {@link EventHandlerDecoratedType} class.
     * @param {EventHandlerId} eventHandlerId - The event handler id.
     * @param {ScopeId} scopeId - The event handler scope id.
     * @param {boolean} partitioned - Whether the event handler is partitioned or not.
     * @param {EventHandlerAlias} alias - The alias of the event handler.
     * @param {Constructor<any>} type - The type that implements the event handler.
     */
    constructor(
        readonly eventHandlerId: EventHandlerId,
        readonly scopeId: ScopeId,
        readonly partitioned: boolean,
        readonly alias: EventHandlerAlias,
        readonly type: Constructor<any>) {
    }
}

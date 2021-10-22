// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';

import { ScopeId } from '@dolittle/sdk.events';

import { EventHandlerAlias, EventHandlerId } from '..';
import { EventHandlerDecoratedTypes } from './EventHandlerDecoratedTypes';
import { EventHandlerDecoratedType } from './EventHandlerDecoratedType';
import { EventHandlerOptions } from './EventHandlerOptions';

/**
 * Decorator to mark a class as an EventHandler.
 * @param {EventHandlerId | Guid | string} eventHandlerId The id to associate with this EventHandler
 * @param {EventHandlerOptions} [options={}] Options to give to the EventHandler
 */
export function eventHandler(eventHandlerId: EventHandlerId | Guid | string, options: EventHandlerOptions = {}) {
    return function (target: any) {
        EventHandlerDecoratedTypes.register(new EventHandlerDecoratedType(
            EventHandlerId.from(eventHandlerId),
            options.inScope ? ScopeId.from(options.inScope) : ScopeId.default,
            options.partitioned === undefined || options.partitioned,
            options.alias !== undefined ? EventHandlerAlias.from(options.alias) : undefined,
            target));
    };
}

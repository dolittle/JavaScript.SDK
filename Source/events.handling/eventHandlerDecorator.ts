// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';

import { ScopeId } from '@dolittle/sdk.events';

import { EventHandlerDecoratedTypes } from './EventHandlerDecoratedTypes';
import { EventHandlerId } from './EventHandlerId';
import { EventHandlerDecoratedType } from './EventHandlerDecoratedType';
import { EventHandlerOptions } from './EventHandlerOptions';

/**
 * Decorator to mark a class as an EventHandler.
 * @param {string | Guid | EventHandlerId} eventHandlerId EventHandler's given id
 * @param {EventHandlerOptions} [options={}] Options to give to the EventHandler
 */
export function eventHandler(eventHandlerId: string | Guid | EventHandlerId, options: EventHandlerOptions = {}) {
    return function (target: any) {
        EventHandlerDecoratedTypes.register(new EventHandlerDecoratedType(
            EventHandlerId.from(eventHandlerId),
            options.inScope ? ScopeId.from(options.inScope) : ScopeId.default,
            !options.unpartitioned,
            target));
    };
}

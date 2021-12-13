// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

import { Decorators } from '@dolittle/sdk.common';
import { ScopeId } from '@dolittle/sdk.events';

import { EventHandlerAlias } from '../EventHandlerAlias';
import { EventHandlerId } from '../EventHandlerId';
import { EventHandlerDecoratedType } from './EventHandlerDecoratedType';
import { EventHandlerOptions } from './EventHandlerOptions';

const [decorator, getMetadata] = Decorators.createMetadataDecorator<EventHandlerDecoratedType>('event-handler', 'eventHandler', Decorators.DecoratorTarget.Class);

/**
 * Decorator to mark a class as an EventHandler.
 * @param {EventHandlerId | Guid | string} eventHandlerId - The id to associate with this EventHandler.
 * @param {EventHandlerOptions} [options={}] - Options to give to the EventHandler.
 * @returns {Decorators.Decorator} The decorator to apply.
 */
export function eventHandler(eventHandlerId: EventHandlerId | Guid | string, options: EventHandlerOptions = {}): Decorators.Decorator {
    return decorator((target, type) => {
        return new EventHandlerDecoratedType(
            EventHandlerId.from(eventHandlerId),
            options.inScope ? ScopeId.from(options.inScope) : ScopeId.default,
            options.partitioned === undefined || options.partitioned,
            EventHandlerAlias.from(options.alias ?? type.name),
            type);
    });
}

/**
 * Gets the {@link EventHandlerDecoratedType} of the specified class.
 * @param {Constructor<any>} type - The class to get the decorated event handler type for.
 * @returns {EventHandlerDecoratedType | undefined} The decorated event handler type if decorated.
 */
export function getEventHandlerDecoratedType(type: Constructor<any>): EventHandlerDecoratedType | undefined {
    return getMetadata(type);
}

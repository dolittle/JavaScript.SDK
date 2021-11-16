// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';
import { Generation } from '@dolittle/sdk.artifacts';
import { EventTypeAlias } from './EventTypeAlias';
import { EventTypeId, EventTypeIdLike } from './EventTypeId';
import { EventTypeOptions } from './EventTypeOptions';
import { EventTypesFromDecorators } from './EventTypesFromDecorators';

/**
 * Decorator for associating an event with an artifact.
 * @param {EventTypeId | Guid | string} identifier - The id to associate with this type.
 * @param {EventTypeOptions} - - [options={} Options to give to the EventHandler.
 * @param options
 */
export function eventType(identifier: EventTypeIdLike, options: EventTypeOptions = {}) {
    return function (target: any) {
        const constructor: Constructor<any> = target.prototype.constructor;
        const alias = options.alias !== undefined ? options.alias : constructor.name;
        EventTypesFromDecorators
            .associate(
                constructor,
                EventTypeId.from(identifier),
                options.generation ? Generation.from(options.generation) : Generation.first,
                EventTypeAlias.from(alias));
    };
}

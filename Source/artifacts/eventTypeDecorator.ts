// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { EventTypeId } from './EventTypeId';
import { EventTypeOptions } from './EventTypeOptions';
import { EventTypesFromDecorators } from './EventTypesFromDecorators';
import { Generation } from './Generation';

/**
 * Decorator for associating an event with an artifact.
 * @param {EventTypeId | Guid | string} identifier The id to associate with this type
 * @param {EventTypeOptions} [options={} Options to give to the EventHandler
 */
export function eventType(identifier: EventTypeId | Guid | string, options: EventTypeOptions = {}) {
    return function (target: any) {
        EventTypesFromDecorators
            .associate(
                target.prototype.constructor,
                EventTypeId.from(identifier),
                options.generation ? Generation.from(options.generation) : Generation.first);
    };
}

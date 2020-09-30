// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { EventType } from './EventType';
import { EventTypeId } from './EventTypeId';
import { EventTypesFromDecorators } from './EventTypesFromDecorators';
import { Generation } from './Generation';

/**
 * Decorator for associating an event with an artifact.
 */
export function eventType(identifier: Guid | string, generationNumber?: number) {
    return function (target: any) {
        EventTypesFromDecorators
            .eventTypes
            .set(
                new EventType(
                    EventTypeId.from(identifier),
                    generationNumber != null ? Generation.from(generationNumber) : Generation.first),
                target.prototype.constructor);
    };
}
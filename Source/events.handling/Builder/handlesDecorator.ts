// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

import { EventTypeId } from '@dolittle/sdk.events';

import { HandlesDecoratedMethods } from './HandlesDecoratedMethods';

/**
 * Decorator for decorating handle methods.
 * @param {Constructor<any> | EventTypeId | Guid | string} typeOrId - The type or the event type id that the method handles.
 * @param {number | undefined} generation - The optional event type generation that the method handles.
 * @returns {(any) => void} The decorator to apply.
 */
export function handles(typeOrId: Constructor<any> | EventTypeId | Guid | string, generation?: number) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        HandlesDecoratedMethods.register(target.constructor, typeOrId, generation, descriptor.value, propertyKey);
    };
}

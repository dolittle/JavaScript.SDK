// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { HandlesDecoratedMethods } from './HandlesDecoratedMethods';
import { Constructor } from '@dolittle/types';

/**
 * Decorator for decorating handle methods.
 */
export function handles(type: Function) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        HandlesDecoratedMethods.register(target.constructor, type as Constructor<any>, descriptor.value);
    };
}

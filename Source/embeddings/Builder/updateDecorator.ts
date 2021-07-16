// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { UpdateDecoratedMethods } from './UpdateDecoratedMethods';

type Returns = (target: any, propertyKey: string, descriptor: PropertyDescriptor) => any | any[];

/**
 * Decorator for decorating the compare function in an embedding class.
 */
export function resolveUpdateToEvents(): Returns {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        UpdateDecoratedMethods.register(target.constructor, descriptor.value, propertyKey);
    };
}

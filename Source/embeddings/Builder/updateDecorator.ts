// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { CompareDecoratedMethods } from './CompareDecoratedMethods';

type Returns = (target: any, propertyKey: string, descriptor: PropertyDescriptor) => any | any[];

/**
 * Decorator for decorating the compare function in an embedding class.
 */
export function resolveUpdateToEvents(): Returns {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        CompareDecoratedMethods.register(target.constructor, descriptor.value, propertyKey);
    };
}

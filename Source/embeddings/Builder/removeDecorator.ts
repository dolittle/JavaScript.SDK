// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { RemoveDecoratedMethods } from './RemoveDecoratedMethods';

type Returns = (target: any, propertyKey: string, descriptor: PropertyDescriptor) => any | any[];

/**
 * Decorator for decorating the delete function in an embedding class.
 */
export function remove(): Returns {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        RemoveDecoratedMethods.register(target.constructor, descriptor.value, propertyKey);
    };
}

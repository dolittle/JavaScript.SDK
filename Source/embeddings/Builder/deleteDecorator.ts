// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { DeletionDecoratedMethods } from './DeletionDecoratedMethods';

type Returns = (target: any, propertyKey: string, descriptor: PropertyDescriptor) => any | any[];

/**
 * Decorator for decorating the delete function in an embedding class.
 */
export function resolveDeletionToEvents(): Returns {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        DeletionDecoratedMethods.register(target.constructor, descriptor.value, propertyKey);
    };
}

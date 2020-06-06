// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { EventDecoratedMethods } from './EventDecoratedMethods';

export function event(type: Function) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        EventDecoratedMethods.register(target.constructor, descriptor.value);
    };
}


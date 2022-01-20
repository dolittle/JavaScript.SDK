// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { CannotDetermineDecoratorTarget } from './CannotDetermineDecoratorTarget';
import { DecoratorTarget } from './DecoratorTarget';

export const getDecoratedTarget = (target: Function | Object, propertyKey?: string | symbol, descriptorOrIndex?: PropertyDescriptor | number): DecoratorTarget => {
    if (typeof target === 'function' && propertyKey === undefined) {
        if (descriptorOrIndex === undefined) {
            return DecoratorTarget.Class;
        }

        if (typeof descriptorOrIndex === 'number') {
            return DecoratorTarget.ConstructorParameter;
        }
    }

    if (typeof target === 'object' && (typeof propertyKey === 'string' || typeof propertyKey === 'symbol')) {
        if (descriptorOrIndex === undefined) {
            return DecoratorTarget.Property;
        }

        if (typeof descriptorOrIndex === 'object') {
            if (typeof descriptorOrIndex.value === 'function') {
                return DecoratorTarget.Method;
            }

            if (typeof descriptorOrIndex.get === 'function') {
                return DecoratorTarget.Getter;
            }

            if (typeof descriptorOrIndex.set === 'function') {
                return DecoratorTarget.Setter;
            }
        }

        if (typeof descriptorOrIndex === 'number') {
            return DecoratorTarget.MethodParameter;
        }
    }

    throw new CannotDetermineDecoratorTarget();
};

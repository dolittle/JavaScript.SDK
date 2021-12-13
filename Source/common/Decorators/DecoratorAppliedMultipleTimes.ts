// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';

import { DecoratorTarget } from './DecoratorTarget';

/**
 * The exception that gets thrown when a decorator that is only permitted once is applied multiple times to the same target.
 */
export class DecoratorAppliedMultipleTimes extends Error {
    /**
     * Initialises a new instance of the {@link DecoratorAppliedMultipleTimes} class.
     * @param {string} displayName - The display name of the decorator.
     * @param {DecoratorTarget} decoratedTarget - The type of the decorated target.
     * @param {Constructor<any>} type - The class that was decorated.
     * @param {Function | Object} target - The decorated target.
     * @param {string | symbol} [propertyKey] - An optional decorated property key.
     * @param {PropertyDescriptor | number} [descriptorOrIndex] - An optional decorated descriptor or index.
     */
    constructor(displayName: string, decoratedTarget: DecoratorTarget, type: Constructor<any>, target: Function | Object, propertyKey?: string | symbol, descriptorOrIndex?: PropertyDescriptor | number) {
        super(`The @${displayName} decorator was applied to ${DecoratorAppliedMultipleTimes.getDecoratedTarget(decoratedTarget, type, target, propertyKey, descriptorOrIndex)} in ${type.name} multiple times. Only one is permitted.`);
    }

    private static getDecoratedTarget(decoratedTarget: DecoratorTarget, type: Constructor<any>, target: Function | Object, propertyKey?: string | symbol, descriptorOrIndex?: PropertyDescriptor | number): string {
        switch (decoratedTarget) {
            case DecoratorTarget.Class:
                return 'the class';
            case DecoratorTarget.ConstructorParameter:
                return `constructor parameter ${descriptorOrIndex}`;
            case DecoratorTarget.Method:
                return `method ${propertyKey!.toString()}`;
            case DecoratorTarget.MethodParameter:
                return `method ${propertyKey!.toString()} parameter ${descriptorOrIndex}`;
            case DecoratorTarget.Property:
                return `property ${propertyKey!.toString()}`;
            case DecoratorTarget.Setter:
                return `setter ${propertyKey!.toString()}`;
            case DecoratorTarget.Getter:
                return `getter ${propertyKey!.toString()}`;
            case DecoratorTarget.All:
                return '';
        }
    }
}

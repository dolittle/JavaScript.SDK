// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';
import { DecoratorTarget } from './DecoratorTarget';
import { getDecoratedTarget } from './getDecoratedTarget';
import { getDecoratorMetadata } from './getDecoratorMetadata';
import { InvalidDecoratorTarget } from './InvalidDecoratorTarget';
import { setDecoratorMetadata } from './setDecoratorMetadata';

type GetMetadataValue<TData> = (type: Constructor<any>) => TData | undefined;

type Decorator<TCallback> = (callback: TCallback) => (target: Function | Object, propertyKey?: string | symbol, descriptorOrIndex?: PropertyDescriptor | number) => void;

type DecoratorCallback<TData> = (target: DecoratorTarget, type: Constructor<any>, propertyKey: string | symbol | undefined, descriptorOrIndex: PropertyDescriptor | number | undefined, value: TData | undefined) => TData;

/**
 * Creates a metadata decorator that is valid for use on the specified targets.
 * @param {string} name - The name of the decorator metadata.
 * @param {string} displayName - The name of the decorator.
 * @param {DecoratorTarget} validTargets - The valid decorator targets.
 * @returns {[Decorator<DecoratorCallback>, GetMetadataValue<TData>]} The decorator function, and the function to use to get the stored metadata value returned from the callback.
 * @template TData The type of the metadata value.
 */
export function createMetadataDecorator<TData>(name: string, displayName: string, validTargets: DecoratorTarget): [Decorator<DecoratorCallback<TData>>, GetMetadataValue<TData>] {
    return [
        function (callback: DecoratorCallback<TData>) {
            return function (target: Function | Object, propertyKey?: string | symbol, descriptorOrIndex?: PropertyDescriptor | number) {
                const decoratedTarget = getDecoratedTarget(target, propertyKey, descriptorOrIndex);
                if ((decoratedTarget & validTargets) === 0) {
                    throw new InvalidDecoratorTarget(displayName, decoratedTarget, validTargets);
                }

                const constructor = (typeof target === 'function' ? target : target.constructor) as Constructor<any>;
                const value = getDecoratorMetadata<TData>(name, constructor);
                const newValue = callback(decoratedTarget, constructor, propertyKey, descriptorOrIndex, value);
                setDecoratorMetadata<TData>(name, constructor, newValue);
            };
        },
        function (type: Constructor<any>) {
            return getDecoratorMetadata(name, type);
        },
    ];
}

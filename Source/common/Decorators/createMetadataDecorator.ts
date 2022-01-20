// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';

import { DecoratorAppliedMultipleTimes } from './DecoratorAppliedMultipleTimes';
import { DecoratorTarget } from './DecoratorTarget';
import { AppliedDecorator, getAppliedDecorators } from './getAppliedDecorators';
import { getDecoratedTarget } from './getDecoratedTarget';
import { getDecoratorMetadata } from './getDecoratorMetadata';
import { InvalidDecoratorTarget } from './InvalidDecoratorTarget';
import { RequiredDecoratorNotApplied } from './RequiredDecoratorNotApplied';
import { setDecoratorMetadata } from './setDecoratorMetadata';

type GetMetadataValue<TData> =
    ((type: Constructor<any>, required?: false, createMetadata?: boolean) => TData | undefined) &
    ((type: Constructor<any>, required: true, reason: string, createMetadata?: boolean) => TData);

type Decorator<TCallback> = (callback: TCallback) => (target: Function | Object, propertyKey?: string | symbol, descriptorOrIndex?: PropertyDescriptor | number) => void;

type DecoratorCallback<TData> = (target: DecoratorTarget, type: Constructor<any>, propertyKey: string | symbol | undefined, descriptorOrIndex: PropertyDescriptor | number | undefined, value: TData | undefined) => TData;

function hasAlreadyAppliedDecorator(appliedDecorators: AppliedDecorator[], name: string, target: Function | Object, propertyKey?: string | symbol, descriptorOrIndex?: PropertyDescriptor | number): boolean {
    for (const decorator of appliedDecorators) {
        if (decorator.name === name && decorator.target === target && decorator.propertyKey === propertyKey && decorator.descriptorOrIndex === descriptorOrIndex) {
            return true;
        }
    }
    return false;
}

/**
 * Creates a metadata decorator that is valid for use on the specified targets.
 * @param {string} name - The name of the decorator metadata.
 * @param {string} displayName - The name of the decorator.
 * @param {DecoratorTarget} validTargets - The valid decorator targets.
 * @param {boolean} [allowMultipleDecorations] - An optional bool that defines whether the decorator can be applied multiple times, defaults to false.
 * @returns {[Decorator<DecoratorCallback>, GetMetadataValue<TData>]} The decorator function, and the function to use to get the stored metadata value returned from the callback.
 * @template TData Type of the metadata value.
 */
export function createMetadataDecorator<TData>(name: string, displayName: string, validTargets: DecoratorTarget, allowMultipleDecorations: boolean = false): [Decorator<DecoratorCallback<TData>>, GetMetadataValue<TData>] {
    return [
        function (callback: DecoratorCallback<TData>) {
            return function (target: Function | Object, propertyKey?: string | symbol, descriptorOrIndex?: PropertyDescriptor | number) {
                const decoratedTarget = getDecoratedTarget(target, propertyKey, descriptorOrIndex);
                if ((decoratedTarget & validTargets) === 0) {
                    throw new InvalidDecoratorTarget(displayName, decoratedTarget, validTargets);
                }

                const constructor = (typeof target === 'function' ? target : target.constructor) as Constructor<any>;

                const appliedDecorators = getAppliedDecorators(constructor);
                const alreadyApplied = hasAlreadyAppliedDecorator(appliedDecorators, name, target, propertyKey, descriptorOrIndex);
                if (alreadyApplied && !allowMultipleDecorations) {
                    throw new DecoratorAppliedMultipleTimes(displayName, decoratedTarget, constructor, target, propertyKey, descriptorOrIndex);
                }

                const value = getDecoratorMetadata<TData>(name, constructor, true);
                const newValue = callback(decoratedTarget, constructor, propertyKey, descriptorOrIndex, value);
                setDecoratorMetadata<TData>(name, constructor, newValue);

                if (!alreadyApplied) {
                    appliedDecorators.push({ name, displayName, target, propertyKey, descriptorOrIndex });
                }
            };
        },
        function (type: Constructor<any>, required?: boolean, maybeRasonOrCreateMetadata?: string | boolean, maybeCreateMetadata?: boolean) {
            const createMetadata =
                typeof maybeCreateMetadata === 'boolean' ? maybeCreateMetadata :
                typeof maybeRasonOrCreateMetadata === 'boolean' ? maybeRasonOrCreateMetadata :
                true;

            const value = getDecoratorMetadata<TData>(name, type, createMetadata);

            if (value === undefined && required === true) {
                throw new RequiredDecoratorNotApplied(displayName, validTargets, type, maybeRasonOrCreateMetadata as string);
            }

            return value;
        } as GetMetadataValue<TData>,
    ];
}

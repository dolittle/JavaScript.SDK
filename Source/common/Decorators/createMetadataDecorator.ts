// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';
import { DecoratorTarget } from './DecoratorTarget';
import { getDecoratedTarget } from './getDecoratedTarget';
import { getDecoratorMetadata } from './getDecoratorMetadata';
import { InvalidDecoratorTarget } from './InvalidDecoratorTarget';
import { setDecoratorMetadata } from './setDecoratorMetadata';

type GetMetadataValue<T> = (type: Constructor<any>) => T | undefined;

type Decorator = (target: Function | Object, propertyKey?: string | symbol, descriptorOrIndex?: PropertyDescriptor | number) => void;

type DecoratorClassCallback<T> = (type: Constructor<any>, value: T | undefined) => T;
type DecoratorConstructorParameterCallback<T> = (type: Constructor<any>, index: number, value: T | undefined) => T;
type DecoratorMethodCallback<T> = (type: Constructor<any>, name: string | symbol, method: Function, value: T | undefined) => T;
type DecoratorMethodParameterCallback<T> = (type: Constructor<any>, name: string | symbol, index: number, value: T | undefined) => T;
type DecoratorPropertyCallback<T> = (type: Constructor<any>, name: string | symbol, value: T | undefined) => T;
type DecoratorSetterCallback<T> = (type: Constructor<any>, name: string | symbol, method: Function, value: T | undefined) => T;
type DecoratorGetterCallback<T> = (type: Constructor<any>, name: string | symbol, method: Function, value: T | undefined) => T;
type DecoratorAllCallback<T> = (type: Constructor<any>, propertyKey: string | symbol | undefined, descriptorOrIndex: PropertyDescriptor | number | undefined, value: T | undefined) => T;

/**
 * Creates a metadata decorator that is valid for use on classes.
 * @param {string} name - The name of the decorator metadata.
 * @param {string} displayName - The name of the decorator.
 * @param {DecoratorTarget.Class} validTargets - The valid decorator targets.
 * @param {DecoratorClassCallback<T>} callback - The callback that will be called when the decorator is used to return the metadata value to store.
 * @returns {[Decorator, GetMetadataValue<T>]} The decorator function, and the function to use to get the stored metadata value returned from the callback.
 * @template T The type of the metadata value.
 */
export function createMetadataDecorator<T>(name: string, displayName: string, validTargets: DecoratorTarget.Class, callback: DecoratorClassCallback<T>): [Decorator, GetMetadataValue<T>];
/**
 * Creates a metadata decorator that is valid for use on class constructor parameters.
 * @param {string} name - The name of the decorator metadata.
 * @param {string} displayName - The name of the decorator.
 * @param {DecoratorTarget.ConstructorParameter} validTargets - The valid decorator targets.
 * @param {DecoratorConstructorParameterCallback<T>} callback - The callback that will be called when the decorator is used to return the metadata value to store.
 * @returns {[Decorator, GetMetadataValue<T>]} The decorator function, and the function to use to get the stored metadata value returned from the callback.
 * @template T The type of the metadata value.
 */
export function createMetadataDecorator<T>(name: string, displayName: string, validTargets: DecoratorTarget.ConstructorParameter, callback: DecoratorConstructorParameterCallback<T>): [Decorator, GetMetadataValue<T>];
/**
 * Creates a metadata decorator that is valid for use on class methods.
 * @param {string} name - The name of the decorator metadata.
 * @param {string} displayName - The name of the decorator.
 * @param {DecoratorTarget.Method} validTargets - The valid decorator targets.
 * @param {DecoratorMethodCallback<T>} callback - The callback that will be called when the decorator is used to return the metadata value to store.
 * @returns {[Decorator, GetMetadataValue<T>]} The decorator function, and the function to use to get the stored metadata value returned from the callback.
 * @template T The type of the metadata value.
 */
export function createMetadataDecorator<T>(name: string, displayName: string, validTargets: DecoratorTarget.Method, callback: DecoratorMethodCallback<T>): [Decorator, GetMetadataValue<T>];
/**
 * Creates a metadata decorator that is valid for use on class method parameters.
 * @param {string} name - The name of the decorator metadata.
 * @param {string} displayName - The name of the decorator.
 * @param {DecoratorTarget.MethodParameter} validTargets - The valid decorator targets.
 * @param {DecoratorMethodParameterCallback<T>} callback - The callback that will be called when the decorator is used to return the metadata value to store.
 * @returns {[Decorator, GetMetadataValue<T>]} The decorator function, and the function to use to get the stored metadata value returned from the callback.
 * @template T The type of the metadata value.
 */
export function createMetadataDecorator<T>(name: string, displayName: string, validTargets: DecoratorTarget.MethodParameter, callback: DecoratorMethodParameterCallback<T>): [Decorator, GetMetadataValue<T>];
/**
 * Creates a metadata decorator that is valid for use on class properties.
 * @param {string} name - The name of the decorator metadata.
 * @param {string} displayName - The name of the decorator.
 * @param {DecoratorTarget.Property} validTargets - The valid decorator targets.
 * @param {DecoratorPropertyCallback<T>} callback - The callback that will be called when the decorator is used to return the metadata value to store.
 * @returns {[Decorator, GetMetadataValue<T>]} The decorator function, and the function to use to get the stored metadata value returned from the callback.
 * @template T The type of the metadata value.
 */
export function createMetadataDecorator<T>(name: string, displayName: string, validTargets: DecoratorTarget.Property, callback: DecoratorPropertyCallback<T>): [Decorator, GetMetadataValue<T>];
/**
 * Creates a metadata decorator that is valid for use on class setters.
 * @param {string} name - The name of the decorator metadata.
 * @param {string} displayName - The name of the decorator.
 * @param {DecoratorTarget.Setter} validTargets - The valid decorator targets.
 * @param {DecoratorSetterCallback<T>} callback - The callback that will be called when the decorator is used to return the metadata value to store.
 * @returns {[Decorator, GetMetadataValue<T>]} The decorator function, and the function to use to get the stored metadata value returned from the callback.
 * @template T The type of the metadata value.
 */
export function createMetadataDecorator<T>(name: string, displayName: string, validTargets: DecoratorTarget.Setter, callback: DecoratorSetterCallback<T>): [Decorator, GetMetadataValue<T>];
/**
 * Creates a metadata decorator that is valid for use on class getters.
 * @param {string} name - The name of the decorator metadata.
 * @param {string} displayName - The name of the decorator.
 * @param {DecoratorTarget.Getter} validTargets - The valid decorator targets.
 * @param {DecoratorGetterCallback<T>} callback - The callback that will be called when the decorator is used to return the metadata value to store.
 * @returns {[Decorator, GetMetadataValue<T>]} The decorator function, and the function to use to get the stored metadata value returned from the callback.
 * @template T The type of the metadata value.
 */
export function createMetadataDecorator<T>(name: string, displayName: string, validTargets: DecoratorTarget.Getter, callback: DecoratorGetterCallback<T>): [Decorator, GetMetadataValue<T>];
/**
 * Creates a metadata decorator that is valid for use on all targets.
 * @param {string} name - The name of the decorator metadata.
 * @param {string} displayName - The name of the decorator.
 * @param {DecoratorTarget.All} validTargets - The valid decorator targets.
 * @param {DecoratorAllCallback<T>} callback - The callback that will be called when the decorator is used to return the metadata value to store.
 * @returns {[Decorator, GetMetadataValue<T>]} The decorator function, and the function to use to get the stored metadata value returned from the callback.
 * @template T The type of the metadata value.
 */
export function createMetadataDecorator<T>(name: string, displayName: string, validTargets: DecoratorTarget.All, callback: DecoratorAllCallback<T>): [Decorator, GetMetadataValue<T>];
export function createMetadataDecorator<T>(name: string, displayName: string, validTargets: DecoratorTarget, callback: any): [Decorator, GetMetadataValue<T>] {
    return [
        function (target: Function | Object, propertyKey?: string | symbol, descriptorOrIndex?: PropertyDescriptor | number) {
            const decoratedTarget = getDecoratedTarget(target, propertyKey, descriptorOrIndex);
            if ((decoratedTarget & validTargets) === 0) {
                throw new InvalidDecoratorTarget(displayName, decoratedTarget, validTargets);
            }

            const constructor = (typeof target === 'function' ? target : target.constructor) as Constructor<any>;
            const value = getDecoratorMetadata<T>(name, constructor);

            let newValue: T;
            switch (validTargets) {
                case DecoratorTarget.Class:
                    newValue = callback(constructor, value);
                    break;
                case DecoratorTarget.ConstructorParameter:
                    newValue = callback(constructor, descriptorOrIndex, value);
                    break;
                case DecoratorTarget.Method:
                    newValue = callback(constructor, propertyKey, (descriptorOrIndex as PropertyDescriptor).value, value);
                    break;
                case DecoratorTarget.MethodParameter:
                    newValue = callback(constructor, propertyKey, descriptorOrIndex, value);
                    break;
                case DecoratorTarget.Property:
                    newValue = callback(constructor, propertyKey, value);
                    break;
                case DecoratorTarget.Setter:
                    newValue = callback(constructor, propertyKey, (descriptorOrIndex as PropertyDescriptor).set, value);
                    break;
                case DecoratorTarget.Getter:
                    newValue = callback(constructor, propertyKey, (descriptorOrIndex as PropertyDescriptor).get, value);
                    break;
                case DecoratorTarget.All:
                    newValue = callback(constructor, propertyKey, descriptorOrIndex, value);
                    break;
            }

            setDecoratorMetadata<T>(name, constructor, newValue);
        },
        function (type: Constructor<any>) {
            return getDecoratorMetadata(name, type);
        },
    ];
}

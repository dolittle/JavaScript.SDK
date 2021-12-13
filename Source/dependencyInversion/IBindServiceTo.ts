// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';

import { IBindServiceScope } from './IBindServiceScope';
import { AsyncServiceFactory } from './AsyncServiceFactory';
import { ServiceFactory } from './ServiceFactory';

/**
 * Defines a system that can specify the resolver of a service binding.
 * @template T - The service binding type.
 */
export abstract class IBindServiceTo<T> {
    /**
     * Sets the service binding to be resolved by constructing a new instance of the provided type.
     * @param {Constructor<T>} type - The type to be constructed by the resolver.
     * @returns {IBindServiceScope} To specify the scope of the binding.
     */
    abstract toType(type: Constructor<T>): IBindServiceScope;

    /**
     * Sets the service binding to be resolved by the provided factory.
     * @param {ServiceFactory<T>} factory - The factory to be called to resolve the service.
     * @returns {IBindServiceScope} To specify the scope of the binding.
     */
    abstract toFactory(factory: ServiceFactory<T>): IBindServiceScope;

    /**
     * Sets the service binding to be resolved by the provided asynchronous factory.
     * @param {AsyncServiceFactory<T>} factory - The asynchronous factory to be called to resolve the service.
     * @returns {IBindServiceScope} To specify the scope of the binding.
     */
    abstract toAsyncFactory(factory: AsyncServiceFactory<T>): IBindServiceScope;

    /**
     * Sets the service binding to be resolved to the provided instance.
     * This binding type is implicitly a singleton binding.
     * @param {T} instance - The instance to resolve the service to.
     */
    abstract toInstance(instance: T): void;
}

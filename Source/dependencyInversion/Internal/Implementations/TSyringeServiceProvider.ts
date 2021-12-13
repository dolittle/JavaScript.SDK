// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { DependencyContainer, InjectionToken } from 'tsyringe';

import { IServiceProvider } from '../../IServiceProvider';
import { ServiceIdentifier } from '../../ServiceIdentifier';

/**
 * Represents an implementation of {@link IServiceProvider} that uses TSyringe as it's underlying implementation.
 */
export class TSyringeServiceProvider extends IServiceProvider {
    /**
     * Initialises a new instance of the {@link InversifyServiceProvider} class.
     * @param {DependencyContainer} _container - The TSyringe container.
     */
    constructor(private readonly _container: DependencyContainer) {
        super();
    }

    /** @inheritdoc */
    has(service: ServiceIdentifier<any>): boolean {
        return this._container.isRegistered(service as InjectionToken);
    }

    /** @inheritdoc */
    get<T>(service: ServiceIdentifier<T>): T {
        return this._container.resolve(service as InjectionToken<T>);
    }

    /** @inheritdoc */
    getAsync<T>(service: ServiceIdentifier<T>): Promise<T> {
        return Promise.resolve(this._container.resolve(service as InjectionToken<T>));
    }

    /** @inheritdoc */
    getAll<T>(service: ServiceIdentifier<T>): T[] {
        return this._container.resolveAll(service as InjectionToken<T>);
    }

    /** @inheritdoc */
    getAllAsync<T>(service: ServiceIdentifier<T>): Promise<T[]> {
        return Promise.resolve(this._container.resolveAll(service as InjectionToken<T>));
    }
}

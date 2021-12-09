// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Container } from 'inversify';

import { IServiceProvider, ServiceIdentifier } from '../..';

/**
 * Represents an implementation of {@link IServiceProvider} that uses InversifyJS as it's underlying implementation.
 */
export class InversifyServiceProvider extends IServiceProvider {
    /**
     * Initialises a new instance of the {@link ServiceProvider} class.
     * @param {Container} container - The InversifyJS child container that contains tenant bindings.
     */
    constructor(readonly container: Container) {
        super();
    }

    /** @inheritdoc */
    has(service: ServiceIdentifier<any>): boolean {
        return this.container.isBound(service);
    }

    /** @inheritdoc */
    get<T>(service: ServiceIdentifier<T>): T {
        return this.container.get<T>(service);
    }

    /** @inheritdoc */
    getAsync<T>(service: ServiceIdentifier<T>): Promise<T> {
        return this.container.getAsync<T>(service);
    }

    /** @inheritdoc */
    getAll<T>(service: ServiceIdentifier<T>): T[] {
        return this.container.getAll<T>(service);
    }

    /** @inheritdoc */
    getAllAsync<T>(service: ServiceIdentifier<T>): Promise<T[]> {
        return this.container.getAllAsync<T>(service);
    }
}

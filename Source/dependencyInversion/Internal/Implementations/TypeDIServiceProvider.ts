// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { TypeDIContainer } from '../../Types/TypeDIContainer';
import { IServiceProvider } from '../../IServiceProvider';
import { ServiceIdentifier } from '../../ServiceIdentifier';

/**
 * Represents an implementation of {@link IServiceProvider} that uses TypeDI as it's underlying implementation.
 */
export class TypeDIServiceProvider extends IServiceProvider {
    /**
     * Initialises a new instance of the {@link TypeDIServiceProvider} class.
     * @param {TypeDIContainer} _container - The TypeDI container.
     */
    constructor(private readonly _container: TypeDIContainer) {
        super();
    }

    /** @inheritdoc */
    has(service: ServiceIdentifier<any>): boolean {
        return this._container.has(this.toAcceptableIdentifier(service));
    }

    /** @inheritdoc */
    get<T>(service: ServiceIdentifier<T>): T {
        return this._container.get<T>(this.toAcceptableIdentifier(service));
    }

    /** @inheritdoc */
    getAsync<T>(service: ServiceIdentifier<T>): Promise<T> {
        return Promise.resolve(this._container.get<T>(this.toAcceptableIdentifier(service)));
    }

    /** @inheritdoc */
    getAll<T>(service: ServiceIdentifier<T>): T[] {
        return this._container.getMany<T>(this.toAcceptableIdentifier(service));
    }

    /** @inheritdoc */
    getAllAsync<T>(service: ServiceIdentifier<T>): Promise<T[]> {
        return Promise.resolve(this._container.getMany<T>(this.toAcceptableIdentifier(service)));
    }

    private toAcceptableIdentifier<T>(service: ServiceIdentifier<T>): any {
        if (typeof service === 'symbol') {
            return service.toString();
        } else {
            return service;
        }
    }
}

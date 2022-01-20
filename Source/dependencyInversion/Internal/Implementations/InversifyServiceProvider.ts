// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { interfaces } from 'inversify';

import { IServiceProvider } from '../../IServiceProvider';
import { ServiceIdentifier } from '../../ServiceIdentifier';

type MethodNameAndImplementation = [string, any];

const nullReflectMetadataMethods: MethodNameAndImplementation[] = [
    ['defineMetadata', () => {}],
    ['hasMetadata', () => false],
    ['hasOwnMetadata', () => false],
    ['getMetadata', () => undefined],
    ['getOwnMetadata', () => undefined],
    ['getMetadataKeys', () => []],
    ['getOwnMetadataKeys', () => []],
    ['deleteMetadata', () => false],
];

const withNullReflectMetadataMethods = <T>(callback: () => T): T => {
    const reflect = Reflect as any;
    const overridden: MethodNameAndImplementation[] = [];

    for (const [methodName, nullImplementation] of nullReflectMetadataMethods) {
        if (typeof reflect[methodName] !== 'function') {
            overridden.push([methodName, reflect[methodName]]);
            reflect[methodName] = nullImplementation;
        }
    }

    const result = callback();

    for (const [methodName, originalImplementation] of overridden) {
        reflect[methodName] = originalImplementation;
    }

    return result;
};

/**
 * Represents an implementation of {@link IServiceProvider} that uses InversifyJS as it's underlying implementation.
 */
export class InversifyServiceProvider extends IServiceProvider {
    /**
     * Initialises a new instance of the {@link InversifyServiceProvider} class.
     * @param {interfaces.Container} container - The InversifyJS container.
     */
    constructor(readonly container: interfaces.Container) {
        super();
    }

    /** @inheritdoc */
    has(service: ServiceIdentifier<any>): boolean {
        return withNullReflectMetadataMethods(() => {
            return this.container.isBound(service);
        });
    }

    /** @inheritdoc */
    get<T>(service: ServiceIdentifier<T>): T {
        return withNullReflectMetadataMethods(() => {
            return this.container.get<T>(service);
        });
    }

    /** @inheritdoc */
    getAsync<T>(service: ServiceIdentifier<T>): Promise<T> {
        return withNullReflectMetadataMethods(() => {
            return this.container.getAsync<T>(service);
        });
    }

    /** @inheritdoc */
    getAll<T>(service: ServiceIdentifier<T>): T[] {
        return withNullReflectMetadataMethods(() => {
            return this.container.getAll<T>(service);
        });
    }

    /** @inheritdoc */
    getAllAsync<T>(service: ServiceIdentifier<T>): Promise<T[]> {
        return withNullReflectMetadataMethods(() => {
            return this.container.getAllAsync<T>(service);
        });
    }
}

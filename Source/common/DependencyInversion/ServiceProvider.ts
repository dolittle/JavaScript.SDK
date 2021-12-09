// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IServiceProvider } from './IServiceProvider';
import { ServiceIdentifier } from './ServiceIdentifier';

/**
 * Represents an implementation of {@link IServiceProvider}.
 */
export class ServiceProvider extends IServiceProvider {
    /** @inheritdoc */
    get<T>(service: ServiceIdentifier<T>): T {
        throw new Error('Method not implemented.');
    }

    /** @inheritdoc */
    getAsync<T>(service: ServiceIdentifier<T>): Promise<T> {
        throw new Error('Method not implemented.');
    }

    /** @inheritdoc */
    getAll<T>(service: ServiceIdentifier<T>): T[] {
        throw new Error('Method not implemented.');
    }

    /** @inheritdoc */
    getAllAsync<T>(service: ServiceIdentifier<T>): Promise<T[]> {
        throw new Error('Method not implemented.');
    }
}

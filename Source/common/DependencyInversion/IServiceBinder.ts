// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IBindServiceTo } from './IBindServiceTo';
import { ServiceIdentifier } from './ServiceIdentifier';

/**
 * Defines a system that can bind services to a {@link ServiceIdentifier}.
 */
export abstract class IServiceBinder {
    /**
     * Creates a new service binding for the specified service identifier.
     * @param {ServiceIdentifier<T>} service - The service identifier to bind.
     * @returns {IBindServiceTo<T>} To specify the binding resolver.
     * @template T - The service binding type.
     */
    abstract bind<T = any>(service: ServiceIdentifier<T>): IBindServiceTo<T>;
}

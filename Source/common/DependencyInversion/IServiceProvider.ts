// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ServiceIdentifier } from './ServiceIdentifier';

/**
 * Defines a system that can provide services bound to a {@link ServiceIdentifier}.
 */
export abstract class IServiceProvider {
    /**
     * Gets the service bound to the provided identifier.
     * @param {ServiceIdentifier} service - The identifier of the service to get.
     * @returns {T} The service.
     * @throws An error if no service is bound to the provided identifier.
     * @template T The Service identifier type.
     */
    abstract get<T>(service: ServiceIdentifier<T>): T;

    /**
     * Gets the service bound to the provided identifier.
     * @param {ServiceIdentifier} service - The identifier of the service to get.
     * @returns {Promise<T>} A promise that when resolved returns the service.
     * @throws An error if no service is bound to the provided identifier.
     * @template T The service identifier type.
     */
    abstract getAsync<T>(service: ServiceIdentifier<T>): Promise<T>;

    /**
     * Gets all services bound to the provided identifier.
     * @param {ServiceIdentifier} service - The identifier of the service to get.
     * @returns {T[]} The services.
     * @template T The service identifier type.
     */
    abstract getAll<T>(service: ServiceIdentifier<T>): T[];

    /**
     * Gets all services bound to the provided identifier.
     * @param {ServiceIdentifier} service - The identifier of the service to get.
     * @returns {Promise<T[]>} A promise that when resolved returns the services.
     * @template T The service identifier type.
     */
    abstract getAllAsync<T>(service: ServiceIdentifier<T>): Promise<T[]>;
}

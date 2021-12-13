// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { TenantId } from '@dolittle/sdk.execution';

import { IServiceBinder } from './IServiceBinder';
import { ServiceBindingCallback } from './ServiceBindingCallback';
import { TenantServiceBindingCallback } from './TenantServiceBindingCallback';

/**
 * Defines a system to register service binding callbacks for building a service provider.
 */
export abstract class IServiceProviderBuilder {
    /**
     * Adds a callback to configure service bindings when building a service provider.
     * @param {ServiceBindingCallback} callback - The callback that will be called with the service binder.
     * @returns {IServiceProviderBuilder} The builder for continuation.
     */
    abstract addServices(callback: ServiceBindingCallback): IServiceProviderBuilder;

    /**
     * Adds a callback to configure tenant specific service bindings when building a service provider.
     * @param {ServiceBindingCallback} callback - The callback that will be called with the service binder and tenant id.
     * @returns {IServiceProviderBuilder} The builder for continuation.
     */
    abstract addTenantServices(callback: TenantServiceBindingCallback): IServiceProviderBuilder;

    /**
     * Calls all the registered callbacks to bind services in the provided service binder.
     * @param {IServiceBinder} binder - The service binder to bind services in.
     */
    abstract bindAllServices(binder: IServiceBinder): void;

    /**
     * Calls all the registered tenant specific callbacks to bind services in the provided service binder.
     * @param {IServiceBinder} binder - The service binder to bind services in.
     * @param {TenantId} tenant - The tenant to bind services for.
     */
    abstract bindAllTenantServices(binder: IServiceBinder, tenant: TenantId): void;
}

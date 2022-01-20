// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { TenantId } from '@dolittle/sdk.execution';

import { IServiceBinder } from './IServiceBinder';
import { IServiceProviderBuilder } from './IServiceProviderBuilder';
import { ServiceBindingCallback } from './ServiceBindingCallback';
import { TenantServiceBindingCallback } from './TenantServiceBindingCallback';

/**
 * Represents an implementation of {@link IServiceProviderBuilder}.
 */
export class ServiceProviderBuilder extends IServiceProviderBuilder {
    private readonly _serviceCallbacks: ServiceBindingCallback[] = [];
    private readonly _tenantServiceCallbacks: TenantServiceBindingCallback[] = [];

    /** @inheritdoc */
    addServices(callback: ServiceBindingCallback): IServiceProviderBuilder {
        this._serviceCallbacks.push(callback);
        return this;
    }

    /** @inheritdoc */
    addTenantServices(callback: TenantServiceBindingCallback): IServiceProviderBuilder {
        this._tenantServiceCallbacks.push(callback);
        return this;
    }

    /** @inheritdoc */
    bindAllServices(binder: IServiceBinder): void {
        for (const callback of this._serviceCallbacks) {
            callback(binder);
        }
    }

    /** @inheritdoc */
    bindAllTenantServices(binder: IServiceBinder, tenant: TenantId): void {
        for (const callback of this._tenantServiceCallbacks) {
            callback(binder, tenant);
        }
    }
}

// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { TenantIdLike } from '@dolittle/sdk.execution';

import { IServiceProvider } from './IServiceProvider';
import { ITenantServiceProviders } from './ITenantServiceProviders';
import { ServiceProvider } from './ServiceProvider';

/**
 * Represents an implementation of {@link ITenantServiceProviders}.
 */
export class TenantServiceProviders extends ITenantServiceProviders {
    /** @inheritdoc */
    forTenant(tenant: TenantIdLike): IServiceProvider {
        return new ServiceProvider();
    }
}

// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Container } from 'inversify';

import { TenantId, TenantIdLike } from '@dolittle/sdk.execution';

import { applyDynamicResolver, DelegatingResolver } from './Internal/Extensions';
import { InversifyServiceProvider } from './Internal/Implementations';
import { IServiceProvider } from './IServiceProvider';
import { ITenantServiceProviders } from './ITenantServiceProviders';
import { TenantServiceProviderNotConfigured } from './TenantServiceProviderNotConfigured';

/**
 * Represents an implementation of {@link ITenantServiceProviders}.
 */
export class TenantServiceProviders extends ITenantServiceProviders {
    private readonly _rootContainer: Container;
    private readonly _tenantContainers: Map<string, IServiceProvider>;

    /**
     * Initialises a new instance of the {@link TenantServiceProviders} class.
     * @param {IServiceProvider} baseServiceProvider - The base service provider to use.
     * @param {TenantId[]} tenants - The tenants to create service providers for.
     */
    constructor(
        baseServiceProvider: IServiceProvider,
        tenants: TenantId[],
    ) {
        super();

        if (baseServiceProvider instanceof InversifyServiceProvider) {
            this._rootContainer = baseServiceProvider.container;
        } else {
            console.log('Creating new container');
            this._rootContainer = new Container();
            applyDynamicResolver(this._rootContainer, new DelegatingResolver(baseServiceProvider));
        }

        this._tenantContainers = new Map<string, IServiceProvider>();
        for (const tenant of tenants) {
            const tenantContainer = this._rootContainer.createChild();

            // TODO: Call configure service things for tenants.

            this._tenantContainers.set(tenant.toString(), new InversifyServiceProvider(tenantContainer));
        }
    }

    /** @inheritdoc */
    forTenant(tenant: TenantIdLike): IServiceProvider {
        const tenantId = TenantId.from(tenant).toString();
        if (!this._tenantContainers.has(tenantId)) {
            throw new TenantServiceProviderNotConfigured(tenantId);
        }

        return this._tenantContainers.get(tenantId)!;
    }
}

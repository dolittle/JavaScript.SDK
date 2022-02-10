// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Tenant } from '@dolittle/sdk.tenancy';
import { Cancellation } from '@dolittle/sdk.resilience';

import { IResourcesBuilder } from '../IResourcesBuilder';

/**
 * Defines a system that can create instances of {@link IResourcesBuilder} by fetching resources from the Runtime.
 */
export abstract class IFetchResources {
    /**
     * Creates a {@link IResourcesBuilder} by fetching resources for the provided tenants.
     * @param {Tenant[]} tenants - The tenants to fetch resources for.
     * @param {Cancellation} [cancellation] - An optional cancellation to cancel the operation.
     * @returns {Promise<IResourcesBuilder>} A {@link Promise} that, when resolved, returns the {@link IResourcesBuilder}.
     */
    abstract fetchResourcesFor(tenants: readonly Tenant[], cancellation?: Cancellation): Promise<IResourcesBuilder>;
}

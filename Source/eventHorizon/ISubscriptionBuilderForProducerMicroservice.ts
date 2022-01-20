// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';

import { TenantId } from '@dolittle/sdk.execution';

import { ISubscriptionBuilderForProducerTenant } from './ISubscriptionBuilderForProducerTenant';

/**
 * Defines a builder for building event horizons for a consumer tenant and producer microservice.
 */
export abstract class ISubscriptionBuilderForProducerMicroservice {
    /**
     * Specifies from which tenant we should get events from in the other microservice.
     * @param {TenantId | Guid | string} tenantId - Tenant for the subscription.
     * @returns {ISubscriptionBuilderForProducerTenant} The builder for creating event horizon subscriptions.
     */
    abstract fromProducerTenant(tenantId: TenantId | Guid | string): ISubscriptionBuilderForProducerTenant;
}

// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';

import { TenantId } from '@dolittle/sdk.execution';

import { ISubscriptionsBuilderForConsumerTenant } from './ISubscriptionsBuilderForConsumerTenant';
import { SubscriptionCompleted, SubscriptionFailed, SubscriptionSucceeded } from './SubscriptionCallbacks';

/**
 * Defines a builder for building event horizons.
 */
export abstract class ISubscriptionsBuilder {
    /**
     * Configure subscriptions for a tenant in our microservice.
     * @param {TenantId | Guid | string} tenantId - The tenant in our microservice.
     * @param {(ISubscriptionsBuilderForConsumerTenant) => void} callback - The subscriptions builder callback.
     * @returns {ISubscriptionsBuilder} The builder for continuation.
     * @summary Two microservices does not need to be aligned on tenancy. This allows for that purpose.
     */
    abstract forTenant(tenantId: TenantId | Guid | string, callback: (builder: ISubscriptionsBuilderForConsumerTenant) => void): ISubscriptionsBuilder;

    /**
     * Sets the {@link SubscriptionCompleted} callback for all subscriptions on the event horizon.
     * @param {SubscriptionCompleted} completed - The callback method.
     * @returns {ISubscriptionsBuilder} The builder for continuation.
     * @summary The callback will be called on each subscription.
     */
    abstract onCompleted(completed: SubscriptionCompleted): ISubscriptionsBuilder;

    /**
     * Sets the {@link SubscriptionSucceeded} callback for all subscriptions on the event horizon.
     * @param {SubscriptionSucceeded} succeeded - The callback method.
     * @returns {ISubscriptionsBuilder} The builder for continuation.
     * @summary The callback will be called on each subscription.
     */
    abstract onSuccess(succeeded: SubscriptionSucceeded): ISubscriptionsBuilder;

    /**
     * Sets the {@link SubscriptionFailed} callback for all subscriptions on the event horizon.
     * @param {SubscriptionFailed} failed - The callback method.
     * @returns {ISubscriptionsBuilder} The builder for continuation.
     * @summary The callback will be called on each subscription.
     */
    abstract onFailure(failed: SubscriptionFailed): ISubscriptionsBuilder;
}

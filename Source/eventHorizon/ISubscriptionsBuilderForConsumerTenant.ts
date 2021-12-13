// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';

import { MicroserviceId } from '@dolittle/sdk.execution';

import { ISubscriptionBuilderForProducerMicroservice } from './ISubscriptionBuilderForProducerMicroservice';
import { SubscriptionCompleted, SubscriptionFailed, SubscriptionSucceeded } from './SubscriptionCallbacks';

/**
 * Defines a builder for building event horizons for a consumer tenant.
 */
export abstract class ISubscriptionsBuilderForConsumerTenant {
    /**
     * Sets the producer microservice to subscribe to events from.
     * @param {Guid | string | MicroserviceId} microserviceId - Microservice to build for.
     * @returns {ISubscriptionBuilderForProducerMicroservice} The builder for creating event horizon subscriptions.
     */
    abstract fromProducerMicroservice(microserviceId: MicroserviceId | Guid | string): ISubscriptionBuilderForProducerMicroservice;

    /**
     * Sets the {@link SubscriptionCompleted} callback for all subscriptions on the event horizon.
     * @param {SubscriptionCompleted} completed - The callback method.
     * @returns {ISubscriptionsBuilderForConsumerTenant} The builder for continuation.
     * @summary The callback will be called on each subscription.
     */
    abstract onCompleted(completed: SubscriptionCompleted): ISubscriptionsBuilderForConsumerTenant;

    /**
     * Sets the {@link SubscriptionSucceeded} callback for all subscriptions on the event horizon.
     * @param {SubscriptionSucceeded} succeeded - The callback method.
     * @returns {ISubscriptionsBuilderForConsumerTenant} The builder for continuation.
     * @summary The callback will be called on each subscription.
     */
    abstract onSuccess(succeeded: SubscriptionSucceeded): ISubscriptionsBuilderForConsumerTenant;

    /**
     * Sets the {@link SubscriptionFailed} callback for all subscriptions on the event horizon.
     * @param {SubscriptionFailed} failed - The callback method.
     * @returns {ISubscriptionsBuilderForConsumerTenant} The builder for continuation.
     * @summary The callback will be called on each subscription.
     */
    abstract onFailure(failed: SubscriptionFailed): ISubscriptionsBuilderForConsumerTenant;
}

// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { SubscriptionCompleted, SubscriptionFailed, SubscriptionSucceeded } from './SubscriptionCallbacks';

/**
 * Defines a builder for building event horizons for a consumer tenant, producer microservice, tenant, stream and partition to a consumer scope.
 */
export abstract class ISubscriptionBuilderForConsumerScope {
    /**
     * Sets the {@link SubscriptionCompleted} callback for all subscriptions on the event horizon.
     * @param {SubscriptionCompleted} completed - The callback method.
     * @returns {ISubscriptionBuilderForConsumerScope} The builder for continuation.
     * @summary The callback will be called on each subscription.
     */
    abstract onCompleted(completed: SubscriptionCompleted): ISubscriptionBuilderForConsumerScope;

    /**
     * Sets the {@link SubscriptionSucceeded} callback for all subscriptions on the event horizon.
     * @param {SubscriptionSucceeded} succeeded - The callback method.
     * @returns {ISubscriptionBuilderForConsumerScope} The builder for continuation.
     * @summary The callback will be called on each subscription.
     */
    abstract onSuccess(succeeded: SubscriptionSucceeded): ISubscriptionBuilderForConsumerScope;

    /**
     * Sets the {@link SubscriptionFailed} callback for all subscriptions on the event horizon.
     * @param {SubscriptionFailed} failed - The callback method.
     * @returns {ISubscriptionBuilderForConsumerScope} The builder for continuation.
     * @summary The callback will be called on each subscription.
     */
    abstract onFailure(failed: SubscriptionFailed): ISubscriptionBuilderForConsumerScope;
}

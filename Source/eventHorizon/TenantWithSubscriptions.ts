// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { TenantId } from '@dolittle/sdk.execution';
import { Subscription } from './Subscription';
import { SubscriptionCompleted, SubscriptionSucceeded, SubscriptionFailed } from './SubscriptionCallbacks';
import { SubscriptionResponse } from './SubscriptionResponse';

/**
 * Represents an event horizon.
 */
export class TenantWithSubscriptions {

    /**
     * Initializes a new instance of {EventHorizon}.
     * @param {TenantId} tenant The tenant in our microservice.
     * @param {Subscription[]} subscriptions The subscriptions to
     * @param {completed} SubscriptionCompleted Completed callback.
     * @param {succeeded} SubscriptionSucceeded Succeeded callback.
     * @param {failed} SubscriptionFailed Failed callback.
     */
    constructor(
        readonly tenant: TenantId,
        readonly subscriptions: Subscription[],
        readonly completed: SubscriptionCompleted,
        readonly succeeded: SubscriptionSucceeded,
        readonly failed: SubscriptionFailed) {
    }

    /**
     * Handles the response coming from a subscription request done to the runtime.
     * @param {TenantId} consumerTenant Consumer tenant the subscription is for.
     * @param {Subscription} subscription The subscription the response is for.
     * @param {SubscriptionResponse} response The response to handle.
     */
    handleResponse(consumerTenant: TenantId, subscription: Subscription, response: SubscriptionResponse): void {
        this.completed(consumerTenant, subscription, response);

        if (response.failed) {
            this.failed(consumerTenant, subscription, response);
        } else {
            this.succeeded(consumerTenant, subscription, response);
        }
    }
}

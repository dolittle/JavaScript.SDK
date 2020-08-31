// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Subscription, TenantWithSubscriptions, SubscriptionResponse } from './index';

/**
 * Defines the capabilities of the event horizons.
 */
export interface IEventHorizons {
    /**
     * Subscriptions by tenant.
     */
    readonly subscriptions: TenantWithSubscriptions[];

    /**
     * Gets response for a specific {@link Subscription}.
     * @param {Subscription} subscription Subscription to get response for.
     * @throws {SubscriptionDoesNotExist} If subscription does not exist.
     */
    getResponseFor(subscription: Subscription): SubscriptionResponse;
}

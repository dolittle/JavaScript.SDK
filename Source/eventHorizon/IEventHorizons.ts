// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Subscription } from './Subscription';
import { SubscriptionResponse } from './SubscriptionResponse';
import { TenantWithSubscriptions } from './TenantWithSubscriptions';

/**
 * Defines the capabilities of the event horizons.
 */
export abstract class IEventHorizons {
    /**
     * Subscriptions by tenant.
     */
    abstract readonly subscriptions: TenantWithSubscriptions[];

    /**
     * Gets response for a specific {@link Subscription}.
     * @param {Subscription} subscription - Subscription to get response for.
     * @throws {SubscriptionDoesNotExist} If subscription does not exist.
     */
    abstract getResponseFor(subscription: Subscription): SubscriptionResponse;
}

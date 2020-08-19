// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { SubscriptionResponse } from './SubscriptionResponse';
import { Subscription } from './Subscription';
import { TenantId } from '@dolittle/sdk.execution';

/**
 * Callback that gets called when a subscription has been completed
 */
export type SubscriptionCompleted = (consumerTenant: TenantId, subscription: Subscription, subscriptionResponse: SubscriptionResponse) => void;

/**
 * Callback that gets called when a subscription has been failed
 */
export type SubscriptionFailed = (consumerTenant: TenantId, subscription: Subscription, subscriptionResponse: SubscriptionResponse) => void;

/**
 * Callback that gets called when a subscription has been succeeded
 */
export type SubscriptionSucceeded = (consumerTenant: TenantId, subscription: Subscription, subscriptionResponse: SubscriptionResponse) => void;
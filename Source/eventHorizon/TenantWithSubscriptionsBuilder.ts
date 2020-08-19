// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { MicroserviceId, TenantId } from '@dolittle/sdk.execution';
import { TenantWithSubscriptions } from './TenantWithSubscriptions';
import { SubscriptionBuilder, SubscriptionBuilderCallback } from './SubscriptionBuilder';
import { SubscriptionCompleted, SubscriptionSucceeded, SubscriptionFailed } from './SubscriptionCallbacks';

export type TenantWithSubscriptionsBuilderCallback = (builder: TenantWithSubscriptionsBuilder) => void;

/**
 * Represents the builder of {@link TenantSubscriptions}.
 */
export class TenantWithSubscriptionsBuilder {
    readonly _subscriptionBuilders: SubscriptionBuilder[] = [];
    private _completed: SubscriptionCompleted = (t, s, sr) => { };
    private _succeeded: SubscriptionSucceeded = (t, s, sr) => { };
    private _failed: SubscriptionFailed = (t, s, sr) => { };

    constructor(private _tenant: TenantId) { }

    /**
     * Build subscriptions for a specific microservice.
     * @param {MicroserviceId} microservice Microservice to build for.
     * @param {SubscriptionBuilderCallback} callback Builder callback.
     * @returns {TenantWithSubscriptionsBuilder}
     */
    forMicroservice(microservice: MicroserviceId, callback: SubscriptionBuilderCallback): TenantWithSubscriptionsBuilder {
        const builder = new SubscriptionBuilder(microservice);
        callback(builder);
        this._subscriptionBuilders.push(builder);
        return this;
    }

    /**
     * Sets the {@link SubscriptionCompleted} callback for all subscriptions on the event horizon
     * @param {SubscriptionCompleted} completed The callback method.
     * @returns {TenantWithSubscriptionsBuilder}
     * @summary The callback will be called on each subscription for the tenant.
     */
    onCompleted(completed: SubscriptionCompleted): TenantWithSubscriptionsBuilder {
        this._completed = completed;
        return this;
    }

    /**
     * Sets the {@link SubscriptionSucceeded} callback for all subscriptions on the event horizon
     * @param {SubscriptionSucceeded} succeeded The callback method.
     * @returns {TenantWithSubscriptionsBuilder}
     * @summary The callback will be called on each subscription for the tenant.
     */
    onSuccess(succeeded: SubscriptionSucceeded): TenantWithSubscriptionsBuilder {
        this._succeeded = succeeded;
        return this;
    }

    /**
     * Sets the {@link SubscriptionFailed} callback for all subscriptions on the event horizon
     * @param {SubscriptionFailed} failed The callback method.
     * @returns {TenantWithSubscriptionsBuilder}
     * @summary The callback will be called on each subscription for the tenant.
     */
    onFailure(failed: SubscriptionFailed): TenantWithSubscriptionsBuilder {
        this._failed = failed;
        return this;
    }

    /**
     * Build the {@link TenantSubscriptions} instance.
     * @returns {TenantWithSubscriptions}
     */
    build(): TenantWithSubscriptions {
        const subscriptions = this._subscriptionBuilders.map(_ => _.build());
        const tenantSubscriptions = new TenantWithSubscriptions(
            this._tenant,
            subscriptions,
            this._completed,
            this._succeeded,
            this._failed);
        return tenantSubscriptions;
    }
}

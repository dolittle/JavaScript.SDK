// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { MicroserviceId, TenantId } from '@dolittle/sdk.execution';
import { TenantSubscriptions } from './TenantSubscriptions';
import { SubscriptionBuilder, SubscriptionBuilderCallback } from './SubscriptionBuilder';

export type TenantSubscriptionsBuilderCallback = (builder: TenantSubscriptionsBuilder) => void;

/**
 * Represents the builder of {@link TenantSubscriptions}.
 */
export class TenantSubscriptionsBuilder {
    readonly _subscriptionBuilders: SubscriptionBuilder[] = [];

    constructor(private _tenant: TenantId) { }

    /**
     * Build subscriptions for a specific microservice.
     * @param {MicroserviceId} microservice Microservice to build for.
     * @param {SubscriptionBuilderCallback} callback Builder callback.
     * @returns {TenantSubscriptionsBuilder}
     */
    forMicroservice(microservice: MicroserviceId, callback: SubscriptionBuilderCallback): TenantSubscriptionsBuilder {
        const builder = new SubscriptionBuilder(microservice);
        callback(builder);
        this._subscriptionBuilders.push(builder);
        return this;
    }

    /**
     * Build the {@link TenantSubscriptions} instance.
     * @returns {TenantSubscriptions}
     */
    build(): TenantSubscriptions {
        const subscriptions = this._subscriptionBuilders.map(_ => _.build());
        const tenantSubscriptions = new TenantSubscriptions(this._tenant, subscriptions);
        return tenantSubscriptions;
    }
}

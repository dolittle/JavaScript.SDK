// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';

import { TenantId } from '@dolittle/sdk.execution';

import { ISubscriptionsBuilder } from './ISubscriptionsBuilder';
import { SubscriptionCallbacks, SubscriptionCompleted, SubscriptionFailed, SubscriptionSucceeded } from './SubscriptionCallbacks';
import { SubscriptionsBuilderForConsumerTenant } from './SubscriptionsBuilderForConsumerTenant';
import { TenantWithSubscriptions } from './TenantWithSubscriptions';

/**
 * Represents an implementation of {@link ISubscriptionsBuilder}.
 */
export class SubscriptionsBuilder extends ISubscriptionsBuilder {
    private readonly _callbacks: SubscriptionCallbacks = new SubscriptionCallbacks();
    private _tenantSubscriptionsBuilders: SubscriptionsBuilderForConsumerTenant[] = [];

    /** @inheritdoc */
    forTenant(tenantId: TenantId | Guid | string, callback: (builder: SubscriptionsBuilderForConsumerTenant) => void): ISubscriptionsBuilder {
        const builder = new SubscriptionsBuilderForConsumerTenant(TenantId.from(tenantId), this._callbacks.responses);
        callback(builder);
        this._tenantSubscriptionsBuilders.push(builder);
        return this;
    }

    /** @inheritdoc */
    onCompleted(completed: SubscriptionCompleted): ISubscriptionsBuilder {
        this._callbacks.onCompleted(completed);
        return this;
    }

    /** @inheritdoc */
    onSuccess(succeeded: SubscriptionSucceeded): ISubscriptionsBuilder {
        this._callbacks.onSucceeded(succeeded);
        return this;
    }

    /** @inheritdoc */
    onFailure(failed: SubscriptionFailed): ISubscriptionsBuilder {
        this._callbacks.onFailed(failed);
        return this;
    }

    /**
     * Build all configured {@link TenantWithSubscriptions}.
     * @returns {[TenantWithSubscriptions[], SubscriptionCallbacks]} The built event horizons.
     */
    build(): [TenantWithSubscriptions[], SubscriptionCallbacks] {
        return [this._tenantSubscriptionsBuilders.map(_ => _.build()), this._callbacks];
    }
}

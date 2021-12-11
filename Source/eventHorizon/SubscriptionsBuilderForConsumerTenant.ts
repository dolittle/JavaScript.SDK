// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Guid } from '@dolittle/rudiments';

import { MicroserviceId, TenantId } from '@dolittle/sdk.execution';

import { ISubscriptionsBuilderForConsumerTenant } from './ISubscriptionsBuilderForConsumerTenant';
import { ISubscriptionBuilderForProducerMicroservice } from './ISubscriptionBuilderForProducerMicroservice';
import { TenantWithSubscriptions } from './TenantWithSubscriptions';
import { SubscriptionBuilderForProducerMicroservice } from './SubscriptionBuilderForProducerMicroservice';
import { SubscriptionCallbacks, SubscriptionCallbackArguments, SubscriptionCompleted, SubscriptionSucceeded, SubscriptionFailed } from './SubscriptionCallbacks';

/**
 * Represents an implementation of {@link ISubscriptionsBuilderForConsumerTenant}.
 */
export class SubscriptionsBuilderForConsumerTenant extends ISubscriptionsBuilderForConsumerTenant {
    private readonly _callbacks: SubscriptionCallbacks;
    readonly _subscriptionBuilders: SubscriptionBuilderForProducerMicroservice[] = [];

    /**
     * Initializes a new instance of {@link SubscriptionsBuilderForConsumerTenant}.
     * @param {TenantId} _consumerTenantId - The consumer tenant.
     * @param {Observable<SubscriptionCallbackArguments>} responsesSource - The source of responses.
     */
    constructor(private _consumerTenantId: TenantId, responsesSource: Observable<SubscriptionCallbackArguments>) {
        super();
        this._callbacks = new SubscriptionCallbacks(
            responsesSource.pipe(filter(_ =>
                _.consumerTenant.toString() === _consumerTenantId.toString())));
    }

    /** @inheritdoc */
    fromProducerMicroservice(microserviceId: MicroserviceId | Guid | string): ISubscriptionBuilderForProducerMicroservice {
        const builder = new SubscriptionBuilderForProducerMicroservice(MicroserviceId.from(microserviceId));
        this._subscriptionBuilders.push(builder);
        return builder;
    }

    /** @inheritdoc */
    onCompleted(completed: SubscriptionCompleted): ISubscriptionsBuilderForConsumerTenant {
        this._callbacks.onCompleted(completed);
        return this;
    }

    /** @inheritdoc */
    onSuccess(succeeded: SubscriptionSucceeded): ISubscriptionsBuilderForConsumerTenant {
        this._callbacks.onSucceeded(succeeded);
        return this;
    }

    /** @inheritdoc */
    onFailure(failed: SubscriptionFailed): ISubscriptionsBuilderForConsumerTenant {
        this._callbacks.onFailed(failed);
        return this;
    }

    /**
     * Build the {@link SubscriptionsBuilderForConsumerTenant} instance.
     * @returns {TenantWithSubscriptions} The built subscriptions for the specified tenant.
     */
    build(): TenantWithSubscriptions {
        const subscriptions = this._subscriptionBuilders.map(_ => _.build(this._callbacks.responses));
        return new TenantWithSubscriptions(this._consumerTenantId, subscriptions, this._callbacks);
    }
}

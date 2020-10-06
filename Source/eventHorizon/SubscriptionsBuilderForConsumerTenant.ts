// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MicroserviceId, TenantId } from '@dolittle/sdk.execution';
import { TenantWithSubscriptions } from './TenantWithSubscriptions';
import { SubscriptionBuilderForProducerMicroservice } from './SubscriptionBuilderForProducerMicroservice';
import { SubscriptionCallbacks, SubscriptionCallbackArguments, SubscriptionCompleted, SubscriptionSucceeded, SubscriptionFailed } from './SubscriptionCallbacks';
import { Guid } from '@dolittle/rudiments';

/**
 * Represents the builder of {@link TenantSubscriptions}.
 */
export class SubscriptionsBuilderForConsumerTenant {
    private readonly _callbacks: SubscriptionCallbacks;
    readonly _subscriptionBuilders: SubscriptionBuilderForProducerMicroservice[] = [];

    /**
     * Initializes a new instance of {@link SubscriptionsBuilderForConsumerTenant}.
     * @param {TenantId} _consumerTenantId The consumer tenant.
     * @param {Observable<SubscriptionCallbackArguments>} responsesSource The source of responses.
     */
    constructor(private _consumerTenantId: TenantId, responsesSource: Observable<SubscriptionCallbackArguments>) {
        this._callbacks = new SubscriptionCallbacks(
            responsesSource.pipe(filter(_ =>
                _.consumerTenant.toString() === _consumerTenantId.toString())));
    }

    /**
     * Sets the producer microservice to subscribe to events from.
     * @param {Guid | string | MicroserviceId} microserviceId Microservice to build for.
     * @returns {SubscriptionBuilderForProducerMicroservice}
     */
    fromProducerMicroservice(microserviceId: MicroserviceId | Guid | string): SubscriptionBuilderForProducerMicroservice {
        const builder = new SubscriptionBuilderForProducerMicroservice(MicroserviceId.from(microserviceId));
        this._subscriptionBuilders.push(builder);
        return builder;
    }

    /**
     * Sets the {@link SubscriptionCompleted} callback for all subscriptions on the event horizon
     * @param {SubscriptionCompleted} completed The callback method.
     * @returns {SubscriptionsBuilderForConsumerTenant}
     * @summary The callback will be called on each subscription for the tenant.
     */
    onCompleted(completed: SubscriptionCompleted): SubscriptionsBuilderForConsumerTenant {
        this._callbacks.onCompleted(completed);
        return this;
    }

    /**
     * Sets the {@link SubscriptionSucceeded} callback for all subscriptions on the event horizon
     * @param {SubscriptionSucceeded} succeeded The callback method.
     * @returns {SubscriptionsBuilderForConsumerTenant}
     * @summary The callback will be called on each subscription for the tenant.
     */
    onSuccess(succeeded: SubscriptionSucceeded): SubscriptionsBuilderForConsumerTenant {
        this._callbacks.onSucceeded(succeeded);
        return this;
    }

    /**
     * Sets the {@link SubscriptionFailed} callback for all subscriptions on the event horizon
     * @param {SubscriptionFailed} failed The callback method.
     * @returns {SubscriptionsBuilderForConsumerTenant}
     * @summary The callback will be called on each subscription for the tenant.
     */
    onFailure(failed: SubscriptionFailed): SubscriptionsBuilderForConsumerTenant {
        this._callbacks.onFailed(failed);
        return this;
    }

    /**
     * Build the {@link SubscriptionsBuilderForConsumerTenant} instance.
     * @returns {TenantWithSubscriptions}
     */
    build(): TenantWithSubscriptions {
        const subscriptions = this._subscriptionBuilders.map(_ => _.build(this._callbacks.responses));
        return new TenantWithSubscriptions(
            this._consumerTenantId,
            subscriptions,
            this._callbacks);
    }
}

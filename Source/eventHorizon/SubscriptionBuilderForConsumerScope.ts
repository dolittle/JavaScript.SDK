// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { StreamId, PartitionId, ScopeId } from '@dolittle/sdk.events';
import { MicroserviceId, TenantId } from '@dolittle/sdk.execution';

import { ISubscriptionBuilderForConsumerScope } from './ISubscriptionBuilderForConsumerScope';
import { Subscription } from './Subscription';
import { SubscriptionCallbackArguments, SubscriptionCallbacks, SubscriptionCompleted, SubscriptionFailed, SubscriptionSucceeded } from './SubscriptionCallbacks';

/**
 * Represents an implementation of {@link ISubscriptionBuilderForConsumerScope}.
 */
export class SubscriptionBuilderForConsumerScope extends ISubscriptionBuilderForConsumerScope {
    private readonly _callbacks: ((subscriptionCallback: SubscriptionCallbacks) => void)[] = [];

    /**
     * Initializes a new instance of the {@link SubscriptionBuilderForConsumerScope} class.
     * @param {MicroserviceId} _producerMicroserviceId - The microservice the subscriptions are for.
     * @param {TenantId} _producerTenantId - The producer tenant id the subscriptions are for.
     * @param {StreamId} _producerStreamId - The producer stream id the subscriptions are for.
     * @param {PartitionId} _producerPartitionId - The producer partition id the subscriptions are for.
     * @param {ScopeId} _consumerScopeId - The consumer scope id the subscription is for.
     */
    constructor(
        private readonly _producerMicroserviceId: MicroserviceId,
        private readonly _producerTenantId: TenantId,
        private readonly _producerStreamId: StreamId,
        private readonly _producerPartitionId: PartitionId,
        private readonly _consumerScopeId: ScopeId
    ) {
        super();
    }

    /** @inheritdoc */
    onCompleted(completed: SubscriptionCompleted): ISubscriptionBuilderForConsumerScope {
        this._callbacks.push(subscriptionCallbacks => subscriptionCallbacks.onCompleted(completed));
        return this;
    }

    /** @inheritdoc */
    onSuccess(succeeded: SubscriptionSucceeded): ISubscriptionBuilderForConsumerScope {
        this._callbacks.push(subscriptionCallbacks => subscriptionCallbacks.onSucceeded(succeeded));
        return this;
    }

    /** @inheritdoc */
    onFailure(failed: SubscriptionFailed): ISubscriptionBuilderForConsumerScope {
        this._callbacks.push(subscriptionCallbacks => subscriptionCallbacks.onFailed(failed));
        return this;
    }

    /**
     * Builds the subscription.
     * @param {Observable<SubscriptionCallbackArguments>} callbackArgumentsSource - The observable source of responses.
     * @returns {Subscription} The built subscription.
     */
    build(callbackArgumentsSource: Observable<SubscriptionCallbackArguments>): Subscription {
        const subscriptionCallbacks = new SubscriptionCallbacks(
            callbackArgumentsSource.pipe(filter(_ =>
                _.subscription.microservice.equals(this._producerMicroserviceId) &&
                _.subscription.partition.equals(this._producerPartitionId) &&
                _.subscription.scope.equals(this._consumerScopeId) &&
                _.subscription.stream.equals(this._producerStreamId) &&
                _.subscription.tenant.equals(this._producerTenantId))));
        for (const callback of this._callbacks) {
            callback(subscriptionCallbacks);
        }
        return new Subscription(
            this._consumerScopeId,
            this._producerMicroserviceId,
            this._producerTenantId,
            this._producerStreamId,
            this._producerPartitionId,
            subscriptionCallbacks);
    }
}

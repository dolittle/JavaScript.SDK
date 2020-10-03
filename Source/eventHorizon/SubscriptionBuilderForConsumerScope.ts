// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.


import { StreamId, PartitionId, ScopeId } from '@dolittle/sdk.events';
import { MicroserviceId, TenantId } from '@dolittle/sdk.execution';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Subscription } from './Subscription';
import { SubscriptionCallbackArguments, SubscriptionCallbacks, SubscriptionCompleted, SubscriptionFailed, SubscriptionSucceeded } from './SubscriptionCallbacks';

/**
 * Represents the builder for building subscriptions on a tenant.
 */
export class SubscriptionBuilderForConsumerScope {

    private readonly _callbacks: SubscriptionCallbacks;
    /**
     * Initializes a new instance of {@link SubscriptionBuilderForConsumerScope}.
     * @param {MicroserviceId} _producerMicroserviceId The microservice the subscriptions are for.
     * @param {Observable<SubscriptionCallbackArguments>} responsesSource The source of responses.
     */
    constructor(
        private readonly _producerMicroserviceId: MicroserviceId,
        private readonly _producerTenantId: TenantId,
        private readonly _producerStreamId: StreamId,
        private readonly _producerPartitionId: PartitionId,
        private readonly _consumerScopeId: ScopeId,
        responsesSource: Observable<SubscriptionCallbackArguments>) {
            this._callbacks = new SubscriptionCallbacks(
                responsesSource.pipe(filter(_ =>
                    _.subscription.scope.toString() === _consumerScopeId.toString())));
    }

    /**
     * Sets the {@link SubscriptionCompleted} callback for all subscriptions on the event horizon
     * @param {SubscriptionCompleted} completed The callback method.
     * @returns {SubscriptionBuilderForConsumerScope}
     * @summary The callback will be called on each subscription.
     */
    onCompleted(completed: SubscriptionCompleted): SubscriptionBuilderForConsumerScope {
        this._callbacks.onCompleted(completed);
        return this;
    }

    /**
     * Sets the {@link SubscriptionSucceeded} callback for all subscriptions on the event horizon
     * @param {SubscriptionSucceeded} succeeded The callback method.
     * @returns {SubscriptionBuilderForConsumerScope}
     * @summary The callback will be called on each subscription.
     */
    onSuccess(succeeded: SubscriptionSucceeded): SubscriptionBuilderForConsumerScope {
        this._callbacks.onSucceeded(succeeded);
        return this;
    }

    /**
     * Sets the {@link SubscriptionFailed} callback for all subscriptions on the event horizon
     * @param {SubscriptionFailed} failed The callback method.
     * @returns {SubscriptionBuilderForConsumerScope}
     * @summary The callback will be called on each subscription.
     */
    onFailure(failed: SubscriptionFailed): SubscriptionBuilderForConsumerScope {
        this._callbacks.onFailed(failed);
        return this;
    }

    /**
     * Builds the subscription.
     * @param {Observable<SubscriptionCallbackArguments} callbackArgumentsSource The observable source of responses.
     * @returns {Subscription}
     */
    build(): Subscription {
        return new Subscription(
            this._consumerScopeId,
            this._producerMicroserviceId,
            this._producerTenantId,
            this._producerStreamId,
            this._producerPartitionId,
            this._callbacks);
    }
}

// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Guid } from '@dolittle/rudiments';

import { ScopeId, PartitionId, StreamId } from '@dolittle/sdk.events';
import { MicroserviceId, TenantId } from '@dolittle/sdk.execution';

import { Subscription } from './Subscription';
import { SubscriptionCallbacks, SubscriptionCallbackArguments, SubscriptionCompleted, SubscriptionFailed, SubscriptionSucceeded} from './SubscriptionCallbacks';
import { MissingScopeForSubscription } from './MissingScopeForSubscription';
import { MissingTenantForSubscription } from './MissingTenantForSubscription';
import { MissingStreamForSubscription } from './MissingStreamForSubscription';
import { SubscriptionBuilderForProducerTenant } from './SubscriptionBuilderForProducerTenant';

/**
 * Represents the callback for the {@link SubscriptionBuilderForProducerMicroservice}.
 */
export type SubscriptionBuilderForProducerMicroserviceCallback = (builder: SubscriptionBuilderForProducerMicroservice) => void;

/**
 * Represents the builder for building subscriptions on a tenant.
 */
export class SubscriptionBuilderForProducerMicroservice {
    private _scope?: ScopeId;
    private _stream?: StreamId;
    private _partition: PartitionId = PartitionId.unspecified;
    private _tenant?: TenantId;
    readonly callbacks: SubscriptionCallbacks = new SubscriptionCallbacks();

    /**
     * Initializes a new instance of {@link SubscriptionBuilderForProducerMicroservice}.
     * @param {MicroserviceId} _microservice The microservice the subscriptions are for.
     * @param {Observable<SubscriptionCallbackArguments>} responsesSource The source of responses.
     */
    constructor(private _microservice: MicroserviceId, responsesSource: Observable<SubscriptionCallbackArguments>) {
        this.callbacks = new SubscriptionCallbacks(responsesSource.pipe(filter(_ =>
            _.subscription.microservice.equals(this._microservice) &&
            _.subscription.scope.equals(this._scope) &&
            _.subscription.stream.equals(this._stream) &&
            _.subscription.tenant.equals(this._tenant) &&
            _.subscription.partition.equals(this._partition))));
    }

    /**
     * Specifies from which tenant we should get events from in the other microservice.
     * @param {Guid | string} tenant Tenant for the subscription.
     */
    fromProducerTenant(tenant: Guid | string): SubscriptionBuilderForProducerTenant {
        this._tenant = TenantId.from(tenant);
        return this;
    }

    /**
     * Sets the {@link SubscriptionCompleted} callback for all subscriptions on the event horizon
     * @param {SubscriptionCompleted} completed The callback method.
     * @returns {SubscriptionBuilderForProducerMicroservice}
     */
    onCompleted(completed: SubscriptionCompleted): SubscriptionBuilderForProducerMicroservice {
        this.callbacks.onCompleted(completed);
        return this;
    }

    /**
     * Sets the {@link SubscriptionSucceeded} callback for all subscriptions on the event horizon
     * @param {SubscriptionSucceeded} succeeded The callback method.
     * @returns {SubscriptionBuilderForProducerMicroservice}
     */
    onSuccess(succeeded: SubscriptionSucceeded): SubscriptionBuilderForProducerMicroservice {
        this.callbacks.onSucceeded(succeeded);
        return this;
    }

    /**
     * Sets the {@link SubscriptionFailed} callback for all subscriptions on the event horizon
     * @param {SubscriptionFailed} failed The callback method.
     * @returns {SubscriptionBuilderForProducerMicroservice}
     */
    onFailure(failed: SubscriptionFailed): SubscriptionBuilderForProducerMicroservice {
        this.callbacks.onFailed(failed);
        return this;
    }

    /**
     * Builds the subscription.
     * @param {Observable<SubscriptionCallbackArguments} callbackArgumentsSource The observable source of responses.
     * @returns {Subscription}
     */
    build(): Subscription {
        this.throwIfMissingScope();
        this.throwIfMissingStream();
        this.throwIfMissingTenant();

        return new Subscription(
            this._scope!,
            this._microservice!,
            this._tenant!,
            this._stream!,
            this._partition!,
            this.callbacks);
    }

    private throwIfMissingScope() {
        if (!this._scope) {
            throw new MissingScopeForSubscription(this._microservice);
        }
    }

    private throwIfMissingStream() {
        if (!this._stream) {
            throw new MissingStreamForSubscription(this._microservice);
        }
    }

    private throwIfMissingTenant() {
        if (!this._tenant) {
            throw new MissingTenantForSubscription(this._microservice);
        }
    }
}

// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Guid } from '@dolittle/rudiments';

import { ScopeId, PartitionId, StreamId } from '@dolittle/sdk.events';
import { MicroserviceId, TenantId } from '@dolittle/sdk.execution';

import {
    Subscription,
    SubscriptionCallbacks,
    SubscriptionCallbackArguments,
    SubscriptionCompleted,
    SubscriptionSucceeded,
    SubscriptionFailed,
    MissingScopeForSubscription,
    MissingTenantForSubscription,
    MissingStreamForSubscription
} from './index';

/**
 * Represents the callback for the {@link SubscriptionBuilder}.
 */
export type SubscriptionBuilderCallback = (builder: SubscriptionBuilder) => void;

/**
 * Represents the builder for building subscriptions on a tenant.
 */
export class SubscriptionBuilder {
    private _scope?: ScopeId;
    private _stream?: StreamId;
    private _partition: PartitionId = PartitionId.unspecified;
    private _tenant?: TenantId;
    readonly callbacks: SubscriptionCallbacks = new SubscriptionCallbacks();

    /**
     * Initializes a new instance of {@link SubscriptionBuilder}.
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
     * Sets the scope in which the subscription is for.
     * @param {Guid | string} scope Scope for the subscription.
     */
    toScope(scope: Guid | string): SubscriptionBuilder {
        this._scope = ScopeId.from(scope);
        return this;
    }

    /**
     * Specifies from which tenant we should get events from.
     * @param {Guid | string} tenant Tenant for the subscription.
     */
    fromTenant(tenant: Guid | string): SubscriptionBuilder {
        this._tenant = TenantId.from(tenant);
        return this;
    }

    /**
     * Specifies the source stream in the other microservice.
     * @param {Guid | string} stream Stream for the subscription.
     */
    forStream(stream: Guid | string): SubscriptionBuilder {
        this._stream = StreamId.from(stream);
        return this;
    }

    /**
     * Specifies which partition the subscription is for.
     * @param {Guid | string} partition
     * @summary This is optional and only to be used if you're only interested in one specific partition.
     */
    forPartition(partition: Guid | string): SubscriptionBuilder {
        this._partition = PartitionId.from(partition);
        return this;
    }

    /**
     * Sets the {@link SubscriptionCompleted} callback for all subscriptions on the event horizon
     * @param {SubscriptionCompleted} completed The callback method.
     * @returns {SubscriptionBuilder}
     */
    onCompleted(completed: SubscriptionCompleted): SubscriptionBuilder {
        this.callbacks.onCompleted(completed);
        return this;
    }

    /**
     * Sets the {@link SubscriptionSucceeded} callback for all subscriptions on the event horizon
     * @param {SubscriptionSucceeded} succeeded The callback method.
     * @returns {SubscriptionBuilder}
     */
    onSuccess(succeeded: SubscriptionSucceeded): SubscriptionBuilder {
        this.callbacks.onSucceeded(succeeded);
        return this;
    }

    /**
     * Sets the {@link SubscriptionFailed} callback for all subscriptions on the event horizon
     * @param {SubscriptionFailed} failed The callback method.
     * @returns {SubscriptionBuilder}
     */
    onFailure(failed: SubscriptionFailed): SubscriptionBuilder {
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

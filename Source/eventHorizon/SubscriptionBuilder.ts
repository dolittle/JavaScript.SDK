// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ScopeId, PartitionId, StreamId } from '@dolittle/sdk.events';

import { MicroserviceId, TenantId } from '@dolittle/sdk.execution';
import { Subscription } from './Subscription';
import { MissingTenantForSubscription } from './MissingTenantForSubscription';
import { MissingStreamForSubscription } from './MissingStreamForSubscription';
import { MissingScopeForSubscription } from './MissingScopeForSubscription';
import { Guid } from '@dolittle/rudiments';
import { SubscriptionCompleted, SubscriptionSucceeded, SubscriptionFailed, SubscriptionCallbackArguments, SubscriptionCallbacks } from './SubscriptionCallbacks';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

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
    private _partition: PartitionId = Guid.empty;
    private _tenant?: TenantId;
    readonly callbacks: SubscriptionCallbacks = new SubscriptionCallbacks();

    /**
     * Initializes a new instance of {@link SubscriptionBuilder}.
     * @param {MicroserviceId} _microservice The microservice the subscriptions are for.
     * @param {Observable<SubscriptionCallbackArguments>} responsesSource The source of responses.
     */
    constructor(private _microservice: MicroserviceId, responsesSource: Observable<SubscriptionCallbackArguments>) {
        this.callbacks = new SubscriptionCallbacks(responsesSource.pipe(filter(_ =>
            _.subscription.microservice.toString() === this._microservice.toString() &&
            _.subscription.scope.toString() === this._scope?.toString() &&
            _.subscription.stream.toString() === this._stream?.toString() &&
            _.subscription.tenant.toString() === this._tenant?.toString() &&
            _.subscription.partition.toString() === this._partition?.toString())));
    }

    /**
     * Sets the scope in which the subscription is for.
     * @param {ScopeId} scope Scope for the subscription.
     */
    toScope(scope: ScopeId): SubscriptionBuilder {
        this._scope = scope;
        return this;
    }

    /**
     * Specifies from which tenant we should get events from.
     * @param {TenantId} tenant Tenant for the subscription.
     */
    fromTenant(tenant: TenantId): SubscriptionBuilder {
        this._tenant = tenant;
        return this;
    }

    /**
     * Specifies the source stream in the other microservice.
     * @param {StreamId} stream Stream for the subscription.
     */
    forStream(stream: StreamId): SubscriptionBuilder {
        this._stream = stream;
        return this;
    }

    /**
     * Specifies which partition the subscription is for.
     * @param {PartitionId} partition
     * @summary This is optional and only to be used if you're only interested in one specific partition.
     */
    forPartition(partition: PartitionId): SubscriptionBuilder {
        this._partition = partition;
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

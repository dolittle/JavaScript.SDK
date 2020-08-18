// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ScopeId, PartitionId, StreamId } from '@dolittle/sdk.events';

import { MicroserviceId, TenantId } from '@dolittle/sdk.execution';
import { Subscription } from './Subscription';
import { MissingTenantForSubscription } from './MissingTenantForSubscription';
import { MissingPartitionForSubscription } from './MissingPartitionForSubscription';
import { MissingStreamForSubscription } from './MissingStreamForSubscription';
import { MissingScopeForSubscription } from './MissingScopeForSubscription';

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
    private _partition?: PartitionId;
    private _tenant?: TenantId;

    /**
     * Initializes a new instance of {@link SubscriptionBuilder}.
     * @param {MicroserviceId} _microservice The microservice the subscriptions are for.
     */
    constructor(private _microservice: MicroserviceId) { }

    /**
     * Sets the scope in which the subscription is for.
     * @param {ScopeId} scope Scope for the subscription.
     */
    inScope(scope: ScopeId) {
        this._scope = scope;
    }

    /**
     * Specifies from which tenant we should get events from.
     * @param {TenantId} tenant Tenant for the subscription.
     */
    fromTenant(tenant: TenantId) {
        this._tenant = tenant;
    }

    /**
     * Specifies the source stream in the other microservice.
     * @param {StreamId} stream Stream for the subscription.
     */
    forStream(stream: StreamId) {
        this._stream = stream;
    }

    /**
     * Specifies which partition the subscription is for.
     * @param {PartitionId} partition
     */
    forPartition(partition: PartitionId) {
        this._partition = partition;
    }

    /**
     * Builds the subscription.
     * @returns {Subscription}
     */
    build(): Subscription {
        this.throwIfMissingScope();
        this.throwIfMissingStream();
        this.throwIfMissingPartition();
        this.throwIfMissingTenant();

        return new Subscription(this._scope!, this._microservice!, this._tenant!, this._stream!, this._partition!);
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

    private throwIfMissingPartition() {
        if (!this._partition) {
            throw new MissingPartitionForSubscription(this._microservice);
        }
    }

    private throwIfMissingTenant() {
        if (!this._tenant) {
            throw new MissingTenantForSubscription(this._microservice);
        }
    }
}

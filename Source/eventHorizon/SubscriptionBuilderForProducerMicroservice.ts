// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Guid } from '@dolittle/rudiments';

import { ScopeId, PartitionId, StreamId } from '@dolittle/sdk.events';
import { MicroserviceId, TenantId } from '@dolittle/sdk.execution';

import { Subscription } from './Subscription';
import { SubscriptionCompleted, SubscriptionFailed, SubscriptionSucceeded} from './SubscriptionCallbacks';
import { MissingScopeForSubscription } from './MissingScopeForSubscription';
import { MissingTenantForSubscription } from './MissingTenantForSubscription';
import { MissingStreamForSubscription } from './MissingStreamForSubscription';

/**
 * Represents the callback for the {@link SubscriptionBuilderForProducerMicroservice}.
 */
export type SubscriptionBuilderForProducerMicroserviceCallback = (builder: SubscriptionBuilderForProducerMicroservice) => void;

/**
 * Represents the builder for building subscriptions on a tenant.
 */
export class SubscriptionBuilderForProducerMicroservice {
    private _tenant?: TenantId;

    /**
     * Initializes a new instance of {@link SubscriptionBuilderForProducerMicroservice}.
     * @param {MicroserviceId} _producerMicroserviceId The microservice the subscriptions are for.
     */
    constructor(private _producerMicroserviceId: MicroserviceId) {
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
     * Builds the subscription.
     * @param {Observable<SubscriptionCallbackArguments} callbackArgumentsSource The observable source of responses.
     * @returns {Subscription}
     */
    build(): Subscription {
        this.throwIfMissingTenant();

        return new Subscription(
            this._scope!,
            this._producerMicroserviceId!,
            this._tenant!,
            this._stream!,
            this._partition!,
            this.callbacks);
    }

    private throwIfMissingTenant() {
        if (!this._tenant) {
            throw new MissingTenantForSubscription(this._producerMicroserviceId);
        }
    }
}

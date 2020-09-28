// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { TenantId, ExecutionContext } from '@dolittle/sdk.execution';

import { SubscriptionsClient } from '@dolittle/runtime.contracts/Runtime/EventHorizon/Subscriptions_grpc_pb';
import { Logger } from 'winston';
import { TenantWithSubscriptionsBuilder, TenantWithSubscriptionsBuilderCallback } from './TenantWithSubscriptionsBuilder';
import { SubscriptionCallbacks, SubscriptionCompleted, SubscriptionFailed, SubscriptionSucceeded } from './SubscriptionCallbacks';
import { EventHorizons } from './EventHorizons';
import { IEventHorizons } from './IEventHorizons';
import { Guid } from '@dolittle/rudiments';

export type EventHorizonsBuilderCallback = (builder: EventHorizonsBuilder) => void;

/**
 * Represents a builder for building event horizons
 */
export class EventHorizonsBuilder {
    private _tenantSubscriptionsBuilders: TenantWithSubscriptionsBuilder[] = [];
    readonly callbacks: SubscriptionCallbacks = new SubscriptionCallbacks();

    /**
     * Configure subscriptions for a tenant in our microservice.
     * @param {Guid | string} tenant The tenant in our microservice.
     * @param {TenantWithSubscriptionsBuilderCallback} callback The subscriptions builder callback.
     * @returns {EventHorizonsBuilder}
     * @summary Two microservices does not need to be aligned on tenancy. This allows for that purpose.
     */
    forTenant(tenant: Guid | string, callback: TenantWithSubscriptionsBuilderCallback): EventHorizonsBuilder {
        const builder = new TenantWithSubscriptionsBuilder(TenantId.from(tenant), this.callbacks.responses);
        callback(builder);
        this._tenantSubscriptionsBuilders.push(builder);
        return this;
    }

    /**
     * Sets the {@link SubscriptionCompleted} callback for all subscriptions on the event horizon
     * @param {SubscriptionCompleted} completed The callback method.
     * @returns {EventHorizonsBuilder}
     * @summary The callback will be called on each subscription.
     */
    onCompleted(completed: SubscriptionCompleted): EventHorizonsBuilder {
        this.callbacks.onCompleted(completed);
        return this;
    }

    /**
     * Sets the {@link SubscriptionSucceeded} callback for all subscriptions on the event horizon
     * @param {SubscriptionSucceeded} succeeded The callback method.
     * @returns {EventHorizonsBuilder}
     * @summary The callback will be called on each subscription.
     */
    onSuccess(succeeded: SubscriptionSucceeded): EventHorizonsBuilder {
        this.callbacks.onSucceeded(succeeded);
        return this;
    }

    /**
     * Sets the {@link SubscriptionFailed} callback for all subscriptions on the event horizon
     * @param {SubscriptionFailed} failed The callback method.
     * @returns {EventHorizonsBuilder}
     * @summary The callback will be called on each subscription.
     */
    onFailure(failed: SubscriptionFailed): EventHorizonsBuilder {
        this.callbacks.onFailed(failed);
        return this;
    }

    /**
     * Build all configured {@link TenantSubscriptions}
     * @param {SubscriptionsClient} subscriptionsClient The runtime client for working with subscriptions.
     * @param {ExecutionContext} executionContext The execution context.
     * @param {Logger} logger Logger for logging;
     * @returns {TenantSubscriptions[]}
     */
    build(subscriptionsClient: SubscriptionsClient, executionContext: ExecutionContext, logger: Logger): IEventHorizons {
        const tenantSubscriptions = this._tenantSubscriptionsBuilders.map(_ => _.build());
        return new EventHorizons(
            subscriptionsClient,
            executionContext,
            tenantSubscriptions,
            this.callbacks,
            logger);
    }
}

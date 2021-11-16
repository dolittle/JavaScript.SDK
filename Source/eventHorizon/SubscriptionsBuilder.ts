// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { SubscriptionsClient } from '@dolittle/runtime.contracts/EventHorizon/Subscriptions_grpc_pb';
import { ExecutionContext, TenantId } from '@dolittle/sdk.execution';
import { Cancellation } from '@dolittle/sdk.resilience';
import { Logger } from 'winston';
import { EventHorizons } from './EventHorizons';
import { IEventHorizons } from './IEventHorizons';
import { SubscriptionCallbacks, SubscriptionCompleted, SubscriptionFailed, SubscriptionSucceeded } from './SubscriptionCallbacks';
import { SubscriptionsBuilderForConsumerTenant } from './SubscriptionsBuilderForConsumerTenant';

/**
 * Defines the callback for building event horizon subscriptions.
 */
export type SubscriptionsBuilderCallback = (builder: SubscriptionsBuilder) => void;

/**
 * Represents a builder for building event horizons.
 */
export class SubscriptionsBuilder {
    private readonly _callbacks: SubscriptionCallbacks = new SubscriptionCallbacks();
    private _tenantSubscriptionsBuilders: SubscriptionsBuilderForConsumerTenant[] = [];

    /**
     * Configure subscriptions for a tenant in our microservice.
     * @param {TenantId | Guid | string} tenantId - The tenant in our microservice.
     * @param {(SubscriptionsBuilderForConsumerTenant) => void} callback - The subscriptions builder callback.
     * @returns {SubscriptionsBuilder} The builder for continuation.
     * @summary Two microservices does not need to be aligned on tenancy. This allows for that purpose.
     */
    forTenant(tenantId: TenantId | Guid | string, callback: (builder: SubscriptionsBuilderForConsumerTenant) => void): SubscriptionsBuilder {
        const builder = new SubscriptionsBuilderForConsumerTenant(TenantId.from(tenantId), this._callbacks.responses);
        callback(builder);
        this._tenantSubscriptionsBuilders.push(builder);
        return this;
    }

    /**
     * Sets the {@link SubscriptionCompleted} callback for all subscriptions on the event horizon.
     * @param {SubscriptionCompleted} completed - The callback method.
     * @returns {SubscriptionsBuilder} The builder for continuation.
     * @summary The callback will be called on each subscription.
     */
    onCompleted(completed: SubscriptionCompleted): SubscriptionsBuilder {
        this._callbacks.onCompleted(completed);
        return this;
    }

    /**
     * Sets the {@link SubscriptionSucceeded} callback for all subscriptions on the event horizon.
     * @param {SubscriptionSucceeded} succeeded - The callback method.
     * @returns {SubscriptionsBuilder} The builder for continuation.
     * @summary The callback will be called on each subscription.
     */
    onSuccess(succeeded: SubscriptionSucceeded): SubscriptionsBuilder {
        this._callbacks.onSucceeded(succeeded);
        return this;
    }

    /**
     * Sets the {@link SubscriptionFailed} callback for all subscriptions on the event horizon.
     * @param {SubscriptionFailed} failed - The callback method.
     * @returns {SubscriptionsBuilder} The builder for continuation.
     * @summary The callback will be called on each subscription.
     */
    onFailure(failed: SubscriptionFailed): SubscriptionsBuilder {
        this._callbacks.onFailed(failed);
        return this;
    }

    /**
     * Build all configured {@link TenantSubscriptions}.
     * @param {SubscriptionsClient} subscriptionsClient - The runtime client for working with subscriptions.
     * @param {ExecutionContext} executionContext - The execution context.
     * @param {Logger} logger - Logger for logging;.
     * @param {Cancellation} cancellation - The cancellation token.
     * @returns {IEventHorizons} The built event horizons.
     */
    build(
        subscriptionsClient: SubscriptionsClient,
        executionContext: ExecutionContext,
        logger: Logger,
        cancellation: Cancellation): IEventHorizons {
        const tenantSubscriptions = this._tenantSubscriptionsBuilders.map(_ => _.build());
        return new EventHorizons(
            subscriptionsClient,
            executionContext,
            tenantSubscriptions,
            this._callbacks,
            logger,
            cancellation);
    }
}

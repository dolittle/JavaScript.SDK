// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { TenantId, IExecutionContextManager } from '@dolittle/sdk.execution';
import { TenantWithSubscriptionsBuilder, TenantWithSubscriptionsBuilderCallback } from './TenantWithSubscriptionsBuilder';
import { IEventHorizons } from './IEventHorizons';
import { EventHorizons } from './EventHorizons';

import { SubscriptionsClient } from '@dolittle/runtime.contracts/Runtime/EventHorizon/Subscriptions_grpc_pb';
import { Logger } from 'winston';
import { SubscriptionCompleted, SubscriptionSucceeded, SubscriptionFailed, SubscriptionCallbacks } from './SubscriptionCallbacks';

export type EventHorizonsBuilderCallback = (builder: EventHorizonsBuilder) => void;

/**
 * Represents a builder for building event horizons
 */
export class EventHorizonsBuilder {
    private _tenantSubscriptionsBuilders: TenantWithSubscriptionsBuilder[] = [];
    private _completed: SubscriptionCompleted = (t, s, sr) => { };
    private _succeeded: SubscriptionSucceeded = (t, s, sr) => { };
    private _failed: SubscriptionFailed = (t, s, sr) => { };

    /**
     * Configure subscriptions for a tenant in our microservice.
     * @param {TenantId} tenant The tenant in our microservice.
     * @param {TenantWithSubscriptionsBuilderCallback} callback The subscriptions builder callback.
     * @returns {EventHorizonsBuilder}
     * @summary Two microservices does not need to be aligned on tenancy. This allows for that purpose.
     */
    forTenant(tenant: TenantId, callback: TenantWithSubscriptionsBuilderCallback): EventHorizonsBuilder {
        const builder = new TenantWithSubscriptionsBuilder(tenant);
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
        this._completed = completed;
        return this;
    }

    /**
     * Sets the {@link SubscriptionSucceeded} callback for all subscriptions on the event horizon
     * @param {SubscriptionSucceeded} succeeded The callback method.
     * @returns {EventHorizonsBuilder}
     * @summary The callback will be called on each subscription.
     */
    onSuccess(succeeded: SubscriptionSucceeded): EventHorizonsBuilder {
        this._succeeded = succeeded;
        return this;
    }

    /**
     * Sets the {@link SubscriptionFailed} callback for all subscriptions on the event horizon
     * @param {SubscriptionFailed} failed The callback method.
     * @returns {EventHorizonsBuilder}
     * @summary The callback will be called on each subscription.
     */
    onFailure(failed: SubscriptionFailed): EventHorizonsBuilder {
        this._failed = failed;
        return this;
    }

    /**
     * Build all configured {@link TenantSubscriptions}
     * @param {SubscriptionsClient} subscriptionsClient The runtime client for working with subscriptions.
     * @param {IExecutionContextManager} executionContextManager For Managing execution context.
     * @param {Logger} logger Logger for logging;
     * @returns {TenantSubscriptions[]}
     */
    build(subscriptionsClient: SubscriptionsClient, executionContextManager: IExecutionContextManager, logger: Logger): IEventHorizons {
        const callbacks = new SubscriptionCallbacks();
        callbacks.onCompleted(this._completed);
        callbacks.onSucceeded(this._succeeded);
        callbacks.onFailed(this._failed);

        const tenantSubscriptions = this._tenantSubscriptionsBuilders.map(_ => _.build(callbacks.responses));
        return new EventHorizons(
            subscriptionsClient,
            executionContextManager,
            tenantSubscriptions,
            callbacks,
            logger);
    }
}

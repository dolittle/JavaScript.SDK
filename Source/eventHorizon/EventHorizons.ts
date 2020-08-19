// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { TenantId, IExecutionContextManager } from '@dolittle/sdk.execution';
import { Subscription } from './Subscription';
import { TenantSubscriptions } from './TenantSubscriptions';
import { IEventHorizons } from './IEventHorizons';

import { callContexts, failures, guids } from '@dolittle/sdk.protobuf';

import { SubscriptionResponse } from './SubscriptionResponse';

import { SubscriptionsClient } from '@dolittle/runtime.contracts/Runtime/EventHorizon/Subscriptions_grpc_pb';
import { Subscription as PbSubscription, SubscriptionResponse as PbSubscriptionResponse } from '@dolittle/runtime.contracts/Runtime/EventHorizon/Subscriptions_pb';
import { Guid } from '@dolittle/rudiments';
import { Logger } from 'winston';

import * as grpc from 'grpc';
import { SubscriptionDoesNotExist } from './SubscriptionDoesNotExist';

/**
 * Represents an implementation of {@link IEventHorizons}.
 */
export class EventHorizons implements IEventHorizons {
    private _subscriptionResponses: Map<Subscription, SubscriptionResponse> = new Map();
    readonly subscriptions: Map<TenantId, Subscription[]> = new Map();

    /**
     * Initializes a new instance of {@link EventHorizons}.
     * @param {SubscriptionsClient} subscriptionsClient The runtime client for working with subscriptions.
     * @param {IExecutionContextManager} executionContextManager For Managing execution context.
     * @param {TenantSubscriptions[]} tenantSubscriptions Tenant subscriptions to connect.
     * @param {Logger} logger Logger for logging;
     */
    constructor(
        readonly _subscriptionsClient: SubscriptionsClient,
        readonly _executionContextManager: IExecutionContextManager,
        tenantSubscriptions: TenantSubscriptions[],
        readonly _logger: Logger) {

        for (const subscription of tenantSubscriptions) {
            this.subscriptions.set(subscription.tenant, subscription.subscriptions);
        }

        this.subscribeAll();
    }

    /**
     * Gets response for a specific {@link Subscription}.
     * @param {Subscription} subscription Subscription to get response for.
     * @throws {SubscriptionDoesNotExist} If subscription does not exist.
     */
    getResponseFor(subscription: Subscription) {
        this.throwIfSubscriptionDoesNotExist(subscription);
        this._subscriptionResponses.get(subscription);
    }

    private throwIfSubscriptionDoesNotExist(subscription: Subscription) {
        if (!this._subscriptionResponses.has(subscription)) {
            throw new SubscriptionDoesNotExist(subscription);
        }
    }

    private subscribeAll() {
        for (const [tenant, subscriptions] of this.subscriptions) {
            for (const subscription of subscriptions) {
                this.subscribe(tenant, subscription);
            }
        }
    }

    private subscribe(consumerTenant: TenantId, subscription: Subscription) {
        this._executionContextManager.currentFor(consumerTenant);

        this._logger.debug(`Subscribing to events from ${subscription.partition} in ${subscription.stream} of ${subscription.tenant} in ${subscription.microservice} for ${consumerTenant} into ${subscription.scope}`);

        const callContext = callContexts.toProtobuf(this._executionContextManager.current);
        callContext.setHeadid(guids.toProtobuf(Guid.create()));

        const pbSubscription = new PbSubscription();
        pbSubscription.setCallcontext(callContext);
        pbSubscription.setPartitionid(guids.toProtobuf(Guid.as(subscription.partition)));
        pbSubscription.setScopeid(guids.toProtobuf(Guid.as(subscription.scope)));
        pbSubscription.setStreamid(guids.toProtobuf(Guid.as(subscription.stream)));
        pbSubscription.setTenantid(guids.toProtobuf(Guid.as(subscription.tenant)));
        pbSubscription.setMicroserviceid(guids.toProtobuf(Guid.as(subscription.microservice)));

        this._subscriptionsClient.subscribe(pbSubscription, (error: grpc.ServiceError | null, pbResponse?: PbSubscriptionResponse) => {
            const response = new SubscriptionResponse(guids.toSDK(pbResponse?.getConsentid()), failures.toSDK(pbResponse?.getFailure()));
            this._subscriptionResponses.set(subscription, response);

            if (response.failed) {
                this._logger.error(`Setting up event horizon subscription failed with '${response.failure?.reason}' - (id:${response.failure?.id}).`);
            }
        });
    }
}

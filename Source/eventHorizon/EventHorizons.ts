// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { Logger } from 'winston';
import * as grpc from '@grpc/grpc-js';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { callContexts, failures, guids } from '@dolittle/sdk.protobuf';
import { SubscriptionsClient } from '@dolittle/runtime.contracts/EventHorizon/Subscriptions_grpc_pb';
import { Subscription as PbSubscription, SubscriptionResponse as PbSubscriptionResponse } from '@dolittle/runtime.contracts/EventHorizon/Subscriptions_pb';

import { Subscription } from './Subscription';
import { IEventHorizons } from './IEventHorizons';
import { SubscriptionResponse } from './SubscriptionResponse';
import { TenantWithSubscriptions } from './TenantWithSubscriptions';
import { SubscriptionCallbacks } from './SubscriptionCallbacks';
import { SubscriptionDoesNotExist } from './SubscriptionDoesNotExist';

/**
 * Represents an implementation of {@link IEventHorizons}.
 */
export class EventHorizons implements IEventHorizons {
    private _subscriptionResponses: Map<Subscription, SubscriptionResponse> = new Map();

    /**
     * Initializes a new instance of {@link EventHorizons}.
     * @param {SubscriptionsClient} subscriptionsClient The runtime client for working with subscriptions.
     * @param {ExecutionContext} executionContext The execution context.
     * @param {TenantWithSubscriptions[]} tenantSubscriptions Tenant subscriptions to connect.
     * @param {SubscriptionCallbacks} callbacks Callbacks for handling responses of subscribing.
     * @param {Logger} logger Logger for logging;
     */
    constructor(
        private _subscriptionsClient: SubscriptionsClient,
        private _executionContext: ExecutionContext,
        readonly subscriptions: TenantWithSubscriptions[],
        readonly callbacks: SubscriptionCallbacks,
        private _logger: Logger) {
        this.subscribeAll();
    }

    /** @inheritdoc */
    getResponseFor(subscription: Subscription): SubscriptionResponse {
        this.throwIfSubscriptionDoesNotExist(subscription);
        return this._subscriptionResponses.get(subscription)!;
    }

    private throwIfSubscriptionDoesNotExist(subscription: Subscription) {
        if (!this._subscriptionResponses.has(subscription)) {
            throw new SubscriptionDoesNotExist(subscription);
        }
    }

    private subscribeAll() {
        for (const tenantWithSubscriptions of this.subscriptions) {
            const consumerTenant = tenantWithSubscriptions.tenant;

            for (const subscription of tenantWithSubscriptions.subscriptions) {
                const executionContext = this._executionContext.forTenant(consumerTenant.value);

                this._logger.debug(`Subscribing to events from ${subscription.partition} in ${subscription.stream} of ${subscription.tenant} in ${subscription.microservice} for ${consumerTenant} into ${subscription.scope}`);

                const callContext = callContexts.toProtobuf(executionContext);
                callContext.setHeadid(guids.toProtobuf(Guid.create()));

                const pbSubscription = new PbSubscription();
                pbSubscription.setCallcontext(callContext);
                pbSubscription.setPartitionid(guids.toProtobuf(subscription.partition.value));
                pbSubscription.setScopeid(guids.toProtobuf(subscription.scope.value));
                pbSubscription.setStreamid(guids.toProtobuf(subscription.stream.value));
                pbSubscription.setTenantid(guids.toProtobuf(subscription.tenant.value));
                pbSubscription.setMicroserviceid(guids.toProtobuf(subscription.microservice.value));

                this._subscriptionsClient.subscribe(pbSubscription, (error: grpc.ServiceError | null, pbResponse?: PbSubscriptionResponse) => {
                    const response = SubscriptionResponse.from(guids.toSDK(pbResponse?.getConsentid()), failures.toSDK(pbResponse?.getFailure()));
                    this._subscriptionResponses.set(subscription, response);

                    this.callbacks.next(consumerTenant, subscription, response);

                    if (response.failed) {
                        this._logger.error(`Setting up event horizon subscription failed with '${response.failure?.reason}' - (id:${response.failure?.id}).`);
                    }
                });
            }
        }
    }
}

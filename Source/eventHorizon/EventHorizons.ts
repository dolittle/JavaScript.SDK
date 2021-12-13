// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Guid } from '@dolittle/rudiments';

import { ExecutionContext, TenantId } from '@dolittle/sdk.execution';
import { ExecutionContexts, Failures, Guids } from '@dolittle/sdk.protobuf';
import { Cancellation, retryPipe, retryWithPolicy } from '@dolittle/sdk.resilience';
import { reactiveUnary } from '@dolittle/sdk.services';

import { SubscriptionsClient } from '@dolittle/runtime.contracts/EventHorizon/Subscriptions_grpc_pb';
import { Subscription as PbSubscription } from '@dolittle/runtime.contracts/EventHorizon/Subscriptions_pb';

import { EventHorizonSubscriptionFailed } from './EventHorizonSubscriptionFailed';
import { IEventHorizons } from './IEventHorizons';
import { Subscription } from './Subscription';
import { SubscriptionCallbacks } from './SubscriptionCallbacks';
import { SubscriptionDoesNotExist } from './SubscriptionDoesNotExist';
import { SubscriptionResponse } from './SubscriptionResponse';
import { TenantWithSubscriptions } from './TenantWithSubscriptions';

/**
 * Represents an implementation of {@link IEventHorizons}.
 */
export class EventHorizons extends IEventHorizons {
    private _subscriptionResponses: Map<Subscription, SubscriptionResponse> = new Map();
    private _retryTimeout = 5;

    /**
     * Initializes a new instance of {@link EventHorizons}.
     * @param {SubscriptionsClient} _subscriptionsClient - The runtime client for working with subscriptions.
     * @param {ExecutionContext} _executionContext - The execution context.
     * @param {TenantWithSubscriptions[]} subscriptions - Tenant subscriptions to connect.
     * @param {SubscriptionCallbacks} callbacks - Callbacks for handling responses of subscribing.
     * @param {Logger} _logger - Logger for logging;.
     * @param {Cancellation} cancellation - Used to cancel all the subscriptions.
     */
    constructor(
        private _subscriptionsClient: SubscriptionsClient,
        private _executionContext: ExecutionContext,
        readonly subscriptions: TenantWithSubscriptions[],
        readonly callbacks: SubscriptionCallbacks,
        private _logger: Logger,
        readonly cancellation: Cancellation) {
        super();
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

                const pbSubscription = this.createSubscriptionRequest(consumerTenant, subscription);
                this.subscribeWithRetry(consumerTenant, subscription, pbSubscription, this.cancellation)
                    .subscribe({
                        complete: () => {
                            this._logger.debug(`Event Horizon subscription complete.`);
                        }
                    });
            }
        }
    }

    private subscribeWithRetry(tenant: TenantId, subscription: Subscription, pbSubscription: PbSubscription, cancellation: Cancellation): Observable<void> {
        return retryWithPolicy(
            this.subscribe(tenant, subscription, pbSubscription),
            retryPipe(delay(this._retryTimeout * 1e3)),
            cancellation);
    }

    private subscribe(tenant: TenantId, subscription: Subscription, pbSubscription: PbSubscription): Observable<void> {
        return new Observable<void>(subscriber => {
            this._logger.debug(`Subscribing to events from microservice ${subscription.microservice} in producer tenant ${subscription.tenant} in producer stream ${subscription.stream} in parttion ${subscription.partition} for consumer tenant ${tenant} into scope ${subscription.scope}`);
            reactiveUnary(this._subscriptionsClient, this._subscriptionsClient.subscribe, pbSubscription, this.cancellation)
                .subscribe({
                    next: pbResponse => {
                        try {
                            const response = SubscriptionResponse.from(Guids.toSDK(pbResponse.getConsentid()), Failures.toSDK(pbResponse.getFailure()));
                            if (response.failed) {
                                this._logger.error(`Failed to subscribe to events from producer microservice ${subscription.microservice} in producer tenant ${subscription.tenant} in producer stream ${subscription.stream} in partition ${subscription.partition} for consumer tenant ${tenant} into scope ${subscription.scope}. Failure id:${response.failure?.id}) and reason: '${response.failure?.reason}'. Will retry in ${this._retryTimeout}s.`);
                                subscriber.error(new EventHorizonSubscriptionFailed(
                                    subscription.microservice.value,
                                    subscription.tenant.value,
                                    subscription.stream.value,
                                    subscription.partition.value,
                                    tenant.value,
                                    subscription.scope.value,
                                    response.failure?.reason?.value,
                                    response.failure?.id?.value
                                ));
                            } else {
                                this._logger.debug(`Succesfully subscribed to events from producer microservice ${subscription.microservice} in producer tenant ${subscription.tenant} in producer stream ${subscription.stream} in partition ${subscription.partition} for consumer tenant ${tenant} into scope ${subscription.scope}.`);
                                this._subscriptionResponses.set(subscription, response);

                                this.callbacks.next(tenant, subscription, response);
                                subscriber.complete();
                            }
                        } catch (error) {
                            this._logger.error(`Error while subscribing to events from producer microservice ${subscription.microservice} in producer tenant ${subscription.tenant} in producer stream ${subscription.stream} in partition ${subscription.partition} for consumer tenant ${tenant} into scope ${subscription.scope}.\n Error: ${error}. Will retry in ${this._retryTimeout}s.`);
                            subscriber.error(error);
                        }
                    },
                    error: error => subscriber.error(error)
                });
        });
    }

    private createSubscriptionRequest(tenant: TenantId, subscription: Subscription) {
        const executionContext = this._executionContext.forTenant(tenant.value);
        const callContext = ExecutionContexts.toCallContext(executionContext);
        callContext.setHeadid(Guids.toProtobuf(Guid.create()));

        const pbSubscription = new PbSubscription();
        pbSubscription.setCallcontext(callContext);
        pbSubscription.setPartitionid(subscription.partition.value);
        pbSubscription.setScopeid(Guids.toProtobuf(subscription.scope.value));
        pbSubscription.setStreamid(Guids.toProtobuf(subscription.stream.value));
        pbSubscription.setTenantid(Guids.toProtobuf(subscription.tenant.value));
        pbSubscription.setMicroserviceid(Guids.toProtobuf(subscription.microservice.value));
        return pbSubscription;
    }
}

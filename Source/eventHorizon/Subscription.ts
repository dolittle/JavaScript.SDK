// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { PartitionId, ScopeId, StreamId } from '@dolittle/sdk.events';
import { TenantId, MicroserviceId } from '@dolittle/sdk.execution';
import { SubscriptionCompleted, SubscriptionSucceeded, SubscriptionFailed } from './SubscriptionCallbacks';
import { SubscriptionResponse } from '.';

/**
 * Represents the configuration of an event horizon subscription.
 */
export class Subscription {

    /**
     * Initializes a new instance of {@link Subscription}.
     * @param {ScopeId} scope Scope for the subscription.
     * @param {MicroserviceId} microservice The microservice to subscribe to.
     * @param {TenantId} tenant The tenant the subscription is for.
     * @param {StreamId} stream The public stream identifier to subscribe to.
     * @param {PartitionId} partition The partition within the public stream.
     * @param {completed} SubscriptionCompleted Completed callback.
     * @param {succeeded} SubscriptionSucceeded Succeeded callback.
     * @param {failed} SubscriptionFailed Failed callback.
     */
    constructor(
        readonly scope: ScopeId,
        readonly microservice: MicroserviceId,
        readonly tenant: TenantId,
        readonly stream: StreamId,
        readonly partition: PartitionId,
        readonly completed: SubscriptionCompleted,
        readonly succeeded: SubscriptionSucceeded,
        readonly failed: SubscriptionFailed) {
    }

    /**
     * Handles the response coming from a subscription request done to the runtime.
     * @param {TenantId} consumerTenant Consumer tenant the subscription is for.
     * @param {SubscriptionResponse} response The response to handle.
     */
    handleResponse(consumerTenant: TenantId, response: SubscriptionResponse): void {
        this.completed(consumerTenant, this, response);

        if (response.failed) {
            this.failed(consumerTenant, this, response);
        } else {
            this.succeeded(consumerTenant, this, response);
        }
    }
}
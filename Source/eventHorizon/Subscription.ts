// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { PartitionId, ScopeId, StreamId } from '@dolittle/sdk.events';
import { TenantId, MicroserviceId } from '@dolittle/sdk.execution';
import { SubscriptionCallbacks } from './index';

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
     * @param {SubscriptionCallbacks} callbacks Callbacks for handling responses of subscribing.
     */
    constructor(
        readonly scope: ScopeId,
        readonly microservice: MicroserviceId,
        readonly tenant: TenantId,
        readonly stream: StreamId,
        readonly partition: PartitionId,
        readonly callbacks: SubscriptionCallbacks) {
    }
}
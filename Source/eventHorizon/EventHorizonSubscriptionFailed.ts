// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception, Guid } from '@dolittle/rudiments';

/**
 * Exception that gets thrown when a failure occurs during event horizon subscription.
 */

export class EventHorizonSubscriptionFailed extends Exception {

    /**
     * Initializes a new instance of {@link EventHorizonSubscriptionFailed}.
     * @param microservice
     * @param producerTenant
     * @param producerStream
     * @param partition
     * @param consumerTenant
     * @param scope
     * @param reason
     * @param identifier
     */
    constructor(microservice: Guid | string, producerTenant: Guid | string, producerStream: Guid | string, partition: Guid | string, consumerTenant: Guid | string, scope: Guid | string, reason?: string, identifier?: Guid | string) {
        super(`Failed to subscribe to events from producer microservice ${microservice} in producer tenant ${producerTenant} in producer stream ${producerStream} in partition ${partition} for consumer tenant ${consumerTenant} into scope ${scope}. Failed with '${reason}' = (id:${identifier})`);
    }
}

// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';

import { StreamId } from '@dolittle/sdk.events';

import { ISubscriptionBuilderForProducerStream } from './ISubscriptionBuilderForProducerStream';

/**
 * Defines a builder for building event horizons for a consumer tenant, producer microservice and tenant.
 */
export abstract class ISubscriptionBuilderForProducerTenant {
    /**
     * Sets the producer stream to subscribe to events from.
     * @param {StreamId | Guid | string} streamId - Stream to subscribe to events from.
     * @returns {ISubscriptionBuilderForProducerStream} The builder for creating event horizon subscriptions.
     */
    abstract fromProducerStream(streamId: StreamId | Guid | string): ISubscriptionBuilderForProducerStream;
}

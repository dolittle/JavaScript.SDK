// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';

import { PartitionId } from '@dolittle/sdk.events';

import { ISubscriptionBuilderForProducerPartition } from './ISubscriptionBuilderForProducerPartition';

/**
 * Defines a builder for building event horizons for a consumer tenant, producer microservice, tenant and stream.
 */
export abstract class ISubscriptionBuilderForProducerStream {
    /**
     * Sets the producer stream to subscribe to events from.
     * @param {PartitionId | Guid | string} partitionId - Stream partition to subscribe to events from.
     * @returns {ISubscriptionBuilderForProducerPartition} The builder for creating event horizon subscriptions.
     */
    abstract fromProducerPartition(partitionId: PartitionId | Guid | string): ISubscriptionBuilderForProducerPartition;
}

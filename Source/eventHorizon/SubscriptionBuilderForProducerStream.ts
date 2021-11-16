// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';

import { StreamId, PartitionId } from '@dolittle/sdk.events';
import { MicroserviceId, TenantId } from '@dolittle/sdk.execution';

import { Subscription } from './Subscription';
import { SubscriptionBuilderMethodAlreadyCalled } from './SubscriptionBuilderMethodAlreadyCalled';
import { SubscriptionDefinitionIncomplete } from './SubscriptionDefinitionIncomplete';
import { SubscriptionBuilderForProducerPartition } from './SubscriptionBuilderForProducerPartition';
import { Observable } from 'rxjs';
import { SubscriptionCallbackArguments } from './SubscriptionCallbacks';

/**
 * Represents the builder for building subscriptions on a tenant.
 */
export class SubscriptionBuilderForProducerStream {
    private _producerPartitionId?: PartitionId;
    private _builder?: SubscriptionBuilderForProducerPartition;

    /**
     * Initializes a new instance of {@link SubscriptionBuilderForProducerStream}.
     * @param {MicroserviceId} _producerMicroserviceId - The microservice the subscriptions are for.
     * @param {Observable<SubscriptionCallbackArguments>} responsesSource - The source of responses.
     * @param _producerTenantId
     * @param _producerStreamId
     */
    constructor(
        private readonly _producerMicroserviceId: MicroserviceId,
        private readonly _producerTenantId: TenantId,
        private readonly _producerStreamId: StreamId) {
    }

    /**
     * Sets the producer stream to subscribe to events from.
     * @param {PartitionId | Guid | string} partitionId - Stream partition to subscribe to events from.
     */
    fromProducerPartition(partitionId: PartitionId | Guid | string): SubscriptionBuilderForProducerPartition {
        this.throwIfProducerPartitionIsAlreadyDefined();
        this._producerPartitionId = PartitionId.from(partitionId);
        this._builder = new SubscriptionBuilderForProducerPartition(
            this._producerMicroserviceId,
            this._producerTenantId,
            this._producerStreamId,
            this._producerPartitionId);
        return this._builder;
    }

    /**
     * Builds the subscription.
     * @param {Observable<SubscriptionCallbackArguments} callbackArgumentsSource - The observable source of responses.
     * @returns {Subscription}
     */
    build(callbackArgumentsSource: Observable<SubscriptionCallbackArguments>): Subscription {
        this.throwIfProducerPartitionIsNotDefined();
        return this._builder!.build(callbackArgumentsSource);
    }

    private throwIfProducerPartitionIsAlreadyDefined() {
        if (this._producerPartitionId) {
            throw new SubscriptionBuilderMethodAlreadyCalled('fromProducerPartition()');
        }
    }
    private throwIfProducerPartitionIsNotDefined() {
        if (!this._producerPartitionId) {
            throw new SubscriptionDefinitionIncomplete('Producer Partition', 'Call fromProducerPartition()');
        }
    }
}

// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Observable } from 'rxjs';
import { Guid } from '@dolittle/rudiments';

import { StreamId, PartitionId } from '@dolittle/sdk.events';
import { MicroserviceId, TenantId } from '@dolittle/sdk.execution';

import { ISubscriptionBuilderForProducerStream } from './ISubscriptionBuilderForProducerStream';
import { ISubscriptionBuilderForProducerPartition } from './ISubscriptionBuilderForProducerPartition';
import { Subscription } from './Subscription';
import { SubscriptionBuilderMethodAlreadyCalled } from './SubscriptionBuilderMethodAlreadyCalled';
import { SubscriptionDefinitionIncomplete } from './SubscriptionDefinitionIncomplete';
import { SubscriptionBuilderForProducerPartition } from './SubscriptionBuilderForProducerPartition';
import { SubscriptionCallbackArguments } from './SubscriptionCallbacks';

/**
 * Represents an implementation of {@link ISubscriptionBuilderForProducerStream}.
 */
export class SubscriptionBuilderForProducerStream extends ISubscriptionBuilderForProducerStream {
    private _producerPartitionId?: PartitionId;
    private _builder?: SubscriptionBuilderForProducerPartition;

    /**
     * Initializes a new instance of the {@link SubscriptionBuilderForProducerStream} class.
     * @param {MicroserviceId} _producerMicroserviceId - The microservice the subscriptions are for.
     * @param {TenantId} _producerTenantId - The producer tenant id the subscriptions are for.
     * @param {StreamId} _producerStreamId - The producer stream id the subscriptions are for.
     */
    constructor(
        private readonly _producerMicroserviceId: MicroserviceId,
        private readonly _producerTenantId: TenantId,
        private readonly _producerStreamId: StreamId
    ) {
        super();
    }

    /** @inheritdoc */
    fromProducerPartition(partitionId: PartitionId | Guid | string): ISubscriptionBuilderForProducerPartition {
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
     * @param {Observable<SubscriptionCallbackArguments>} callbackArgumentsSource - The observable source of responses.
     * @returns {Subscription} The built subscription.
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

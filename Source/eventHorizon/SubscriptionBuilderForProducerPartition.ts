// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Observable } from 'rxjs';
import { Guid } from '@dolittle/rudiments';

import { StreamId, PartitionId, ScopeId } from '@dolittle/sdk.events';
import { MicroserviceId, TenantId } from '@dolittle/sdk.execution';

import { ISubscriptionBuilderForProducerPartition } from './ISubscriptionBuilderForProducerPartition';
import { ISubscriptionBuilderForConsumerScope } from './ISubscriptionBuilderForConsumerScope';
import { Subscription } from './Subscription';
import { SubscriptionBuilderMethodAlreadyCalled } from './SubscriptionBuilderMethodAlreadyCalled';
import { SubscriptionDefinitionIncomplete } from './SubscriptionDefinitionIncomplete';
import { SubscriptionBuilderForConsumerScope } from './SubscriptionBuilderForConsumerScope';
import { SubscriptionCallbackArguments } from './SubscriptionCallbacks';

/**
 * Represents an implementation of {@link ISubscriptionBuilderForProducerPartition}.
 */
export class SubscriptionBuilderForProducerPartition extends ISubscriptionBuilderForProducerPartition {
    private _consumerScopeId?: ScopeId;
    private _builder?: SubscriptionBuilderForConsumerScope;

    /**
     * Initializes a new instance of the {@link SubscriptionBuilderForProducerTenant} class.
     * @param {MicroserviceId} _producerMicroserviceId - The microservice the subscriptions are for.
     * @param {TenantId} _producerTenantId - The producer tenant id the subscriptions are for.
     * @param {StreamId} _producerStreamId - The producer stream id the subscriptions are for.
     * @param {PartitionId} _producerPartitionId - The producer partition id the subscriptions are for.
     */
    constructor(
        private readonly _producerMicroserviceId: MicroserviceId,
        private readonly _producerTenantId: TenantId,
        private readonly _producerStreamId: StreamId,
        private readonly _producerPartitionId: PartitionId
    ) {
        super();
    }

    /** @inheritdoc */
    toScope(scopeId: ScopeId | Guid | string): ISubscriptionBuilderForConsumerScope {
        this.throwIfConsumerScopeIsAlreadyDefined();
        this._consumerScopeId = ScopeId.from(scopeId);
        this._builder = new SubscriptionBuilderForConsumerScope(
            this._producerMicroserviceId,
            this._producerTenantId,
            this._producerStreamId,
            this._producerPartitionId,
            this._consumerScopeId);
        return this._builder;
    }

    /**
     * Builds the subscription.
     * @param {Observable<SubscriptionCallbackArguments>} callbackArgumentsSource - The observable source of responses.
     * @returns {Subscription} The built subscription.
     */
    build(callbackArgumentsSource: Observable<SubscriptionCallbackArguments>): Subscription {
        this.throwIfConsumerScopeIsNotDefined();
        return this._builder!.build(callbackArgumentsSource);
    }

    private throwIfConsumerScopeIsAlreadyDefined() {
        if (this._consumerScopeId) {
            throw new SubscriptionBuilderMethodAlreadyCalled('toScope()');
        }
    }
    private throwIfConsumerScopeIsNotDefined() {
        if (!this._consumerScopeId) {
            throw new SubscriptionDefinitionIncomplete('Scope', 'Call toScope() with a non-default scope');
        }
    }
}

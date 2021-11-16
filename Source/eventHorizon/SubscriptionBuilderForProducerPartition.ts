// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';

import { StreamId, PartitionId, ScopeId } from '@dolittle/sdk.events';
import { MicroserviceId, TenantId } from '@dolittle/sdk.execution';

import { Subscription } from './Subscription';
import { SubscriptionBuilderMethodAlreadyCalled } from './SubscriptionBuilderMethodAlreadyCalled';
import { SubscriptionDefinitionIncomplete } from './SubscriptionDefinitionIncomplete';
import { SubscriptionBuilderForConsumerScope } from './SubscriptionBuilderForConsumerScope';
import { SubscriptionCallbackArguments } from './SubscriptionCallbacks';
import { Observable } from 'rxjs';

/**
 * Represents the builder for building subscriptions on a tenant.
 */
export class SubscriptionBuilderForProducerPartition {
    private _consumerScopeId?: ScopeId;
    private _builder?: SubscriptionBuilderForConsumerScope;

    /**
     * Initializes a new instance of {@link SubscriptionBuilderForProducerTenant}.
     * @param {MicroserviceId} _producerMicroserviceId - The microservice the subscriptions are for.
     * @param {Observable<SubscriptionCallbackArguments>} responsesSource - The source of responses.
     * @param _producerTenantId
     * @param _producerStreamId
     * @param _producerPartitionId
     */
    constructor(
        private readonly _producerMicroserviceId: MicroserviceId,
        private readonly _producerTenantId: TenantId,
        private readonly _producerStreamId: StreamId,
        private readonly _producerPartitionId: PartitionId) {
    }

    /**
     * Sets the producer stream to subscribe to events from.
     * @param {ScopeId | Guid | string} scopeId - Stream to subscribe to events from.
     */
    toScope(scopeId: ScopeId | Guid | string): SubscriptionBuilderForConsumerScope {
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
     * @param {Observable<SubscriptionCallbackArguments} callbackArgumentsSource - The observable source of responses.
     * @returns {Subscription}
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

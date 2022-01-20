// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';

import { ScopeId } from '@dolittle/sdk.events';

import { ISubscriptionBuilderForConsumerScope } from './ISubscriptionBuilderForConsumerScope';

/**
 * Defines a builder for building event horizons for a consumer tenant, producer microservice, tenant, stream and partition.
 */
export abstract class ISubscriptionBuilderForProducerPartition {
    /**
     * Sets the producer stream to subscribe to events from.
     * @param {ScopeId | Guid | string} scopeId - Stream to subscribe to events from.
     * @returns {ISubscriptionBuilderForConsumerScope} The builder for creating event horizon subscriptions.
     */
    abstract toScope(scopeId: ScopeId | Guid | string): ISubscriptionBuilderForConsumerScope;
}

// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';

import { StreamId } from '@dolittle/sdk.events';
import { MicroserviceId, TenantId } from '@dolittle/sdk.execution';

import { Subscription } from './Subscription';
import { SubscriptionBuilderMethodAlreadyCalled } from './SubscriptionBuilderMethodAlreadyCalled';
import { SubscriptionDefinitionIncomplete } from './SubscriptionDefinitionIncomplete';
import { SubscriptionBuilderForProducerStream } from './SubscriptionBuilderForProducerStream';
import { Observable } from 'rxjs';
import { SubscriptionCallbackArguments} from './SubscriptionCallbacks';

/**
 * Represents the builder for building subscriptions on a tenant.
 */
export class SubscriptionBuilderForProducerTenant {
    private _producerStreamId?: StreamId;
    private _builder?: SubscriptionBuilderForProducerStream;

    /**
     * Initializes a new instance of {@link SubscriptionBuilderForProducerTenant}.
     * @param {MicroserviceId} _producerMicroserviceId The microservice the subscriptions are for.
     * @param {Observable<SubscriptionCallbackArguments>} responsesSource The source of responses.
     */
    constructor(
        private readonly _producerMicroserviceId: MicroserviceId,
        private readonly _producerTenantId: TenantId) {
    }

    /**
     * Sets the producer stream to subscribe to events from.
     * @param {Guid | string} tenant Stream to subscribe to events from.
     */
    fromProducerStream(streamId: Guid | string): SubscriptionBuilderForProducerStream {
        this.throwIfProducerStreamIsAlreadyDefined();
        this._producerStreamId = StreamId.from(streamId);
        this._builder = new SubscriptionBuilderForProducerStream(
            this._producerMicroserviceId,
            this._producerTenantId,
            this._producerStreamId);
        return this._builder;
    }

    /**
     * Builds the subscription.
     * @param {Observable<SubscriptionCallbackArguments} callbackArgumentsSource The observable source of responses.
     * @returns {Subscription}
     */
    build(callbackArgumentsSource: Observable<SubscriptionCallbackArguments>): Subscription {
        this.throwIfProducerStreamIsNotDefined();
        return this._builder!.build(callbackArgumentsSource);
    }

    private throwIfProducerStreamIsAlreadyDefined() {
        if (this._producerStreamId) {
            throw new SubscriptionBuilderMethodAlreadyCalled('fromStream()');
        }
    }
    private throwIfProducerStreamIsNotDefined() {
        if (!this._producerStreamId) {
            throw new SubscriptionDefinitionIncomplete('Producer Stream', 'Call fromProducerStream()');
        }
    }
}

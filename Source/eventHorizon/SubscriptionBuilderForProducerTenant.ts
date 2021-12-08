// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Observable } from 'rxjs';
import { Guid } from '@dolittle/rudiments';

import { StreamId } from '@dolittle/sdk.events';
import { MicroserviceId, TenantId } from '@dolittle/sdk.execution';

import { ISubscriptionBuilderForProducerTenant } from './ISubscriptionBuilderForProducerTenant';
import { ISubscriptionBuilderForProducerStream } from './ISubscriptionBuilderForProducerStream';
import { Subscription } from './Subscription';
import { SubscriptionBuilderMethodAlreadyCalled } from './SubscriptionBuilderMethodAlreadyCalled';
import { SubscriptionDefinitionIncomplete } from './SubscriptionDefinitionIncomplete';
import { SubscriptionBuilderForProducerStream } from './SubscriptionBuilderForProducerStream';
import { SubscriptionCallbackArguments} from './SubscriptionCallbacks';

/**
 * Represents an implementation of {@link ISubscriptionBuilderForProducerTenant}.
 */
export class SubscriptionBuilderForProducerTenant extends ISubscriptionBuilderForProducerTenant {
    private _producerStreamId?: StreamId;
    private _builder?: SubscriptionBuilderForProducerStream;

    /**
     * Initializes a new instance of the {@link SubscriptionBuilderForProducerTenant} class.
     * @param {MicroserviceId} _producerMicroserviceId - The microservice the subscriptions are for.
     * @param {TenantId} _producerTenantId - The producer tenant id the subscriptions are for.
     */
    constructor(
        private readonly _producerMicroserviceId: MicroserviceId,
        private readonly _producerTenantId: TenantId
    ) {
        super();
    }

    /** @inheritdoc */
    fromProducerStream(streamId: StreamId | Guid | string): ISubscriptionBuilderForProducerStream {
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
     * @param {Observable<SubscriptionCallbackArguments>} callbackArgumentsSource - The observable source of responses.
     * @returns {Subscription} The built subscription.
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

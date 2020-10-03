// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';

import { MicroserviceId, TenantId } from '@dolittle/sdk.execution';

import { Subscription } from './Subscription';
import { SubscriptionBuilderForProducerTenant  } from './SubscriptionBuilderForProducerTenant';
import { SubscriptionDefinitionIncomplete } from './SubscriptionDefinitionIncomplete';
import { SubscriptionBuilderMethodAlreadyCalled } from './SubscriptionBuilderMethodAlreadyCalled';
import { SubscriptionCallbackArguments, SubscriptionCallbacks } from './SubscriptionCallbacks';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

/**
 * Represents the builder for building subscriptions on a tenant.
 */
export class SubscriptionBuilderForProducerMicroservice {
    private readonly _callbacks: SubscriptionCallbacks;
    private _producerTenantId?: TenantId;
    private _builder?: SubscriptionBuilderForProducerTenant;


    /**
     * Initializes a new instance of {@link SubscriptionBuilderForProducerMicroservice}.
     * @param {MicroserviceId} _producerMicroserviceId The microservice the subscriptions are for.
     */
    constructor(
        private readonly _producerMicroserviceId: MicroserviceId, responsesSource: Observable<SubscriptionCallbackArguments>) {
            this._callbacks = new SubscriptionCallbacks(
                responsesSource.pipe(filter(_ =>
                    _.subscription.microservice.toString() === _producerMicroserviceId.toString())));
    }

    /**
     * Specifies from which tenant we should get events from in the other microservice.
     * @param {Guid | string} tenantId Tenant for the subscription.
     */
    fromProducerTenant(tenantId: Guid | string): SubscriptionBuilderForProducerTenant {
        this.throwIfProducerTenantIsAlreadyDefined();
        this._producerTenantId = TenantId.from(tenantId);
        this._builder = new SubscriptionBuilderForProducerTenant(this._producerMicroserviceId, this._producerTenantId, this._callbacks.responses);
        return this._builder;
    }

    /**
     * Builds the subscription.
     * @param {Observable<SubscriptionCallbackArguments} callbackArgumentsSource The observable source of responses.
     * @returns {Subscription}
     */
    build(): Subscription {
        this.throwIfProducerTenantIsNotDefined();
        return this._builder!.build();
    }

    private throwIfProducerTenantIsAlreadyDefined() {
        if (this._producerTenantId) {
            throw new SubscriptionBuilderMethodAlreadyCalled('fromProducerTenant()');
        }
    }
    private throwIfProducerTenantIsNotDefined() {
        if (!this._producerTenantId) {
            throw new SubscriptionDefinitionIncomplete('Producer Tenant', 'Call fromProducerTenant()');
        }
    }
}

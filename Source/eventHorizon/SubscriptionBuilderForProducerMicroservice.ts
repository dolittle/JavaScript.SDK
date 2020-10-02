// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';

import { MicroserviceId, TenantId } from '@dolittle/sdk.execution';

import { Subscription } from './Subscription';
import { SubscriptionBuilderForProducerTenant  } from './SubscriptionBuilderForProducerTenant';
import { SubscriptionDefinitionIncomplete } from './SubscriptionDefinitionIncomplete';
import { SubscriptionBuilderMethodAlreadyCalled } from './SubscriptionBuilderMethodAlreadyCalled';

/**
 * Represents the builder for building subscriptions on a tenant.
 */
export class SubscriptionBuilderForProducerMicroservice {
    private _producerTenant?: TenantId;
    private _builder?: SubscriptionBuilderForProducerTenant;

    /**
     * Initializes a new instance of {@link SubscriptionBuilderForProducerMicroservice}.
     * @param {MicroserviceId} _producerMicroserviceId The microservice the subscriptions are for.
     */
    constructor(
        private readonly _consumerTenantId: TenantId,
        private readonly _producerMicroserviceId: MicroserviceId) {
    }

    /**
     * Specifies from which tenant we should get events from in the other microservice.
     * @param {Guid | string} tenant Tenant for the subscription.
     */
    fromProducerTenant(tenant: Guid | string): SubscriptionBuilderForProducerTenant {
        this.throwIfProducerTenantIsAlreadyDefined();
        this._producerTenant = TenantId.from(tenant);
        this._builder = new SubscriptionBuilderForProducerTenant(this._consumerTenantId, this._producerMicroserviceId, this._producerTenant);
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
        if (this._producerTenant) {
            throw new SubscriptionBuilderMethodAlreadyCalled('fromProducerTenant()');
        }
    }
    private throwIfProducerTenantIsNotDefined() {
        if (!this._producerTenant) {
            throw new SubscriptionDefinitionIncomplete('Producer Tenant', 'Call fromProducerTenant()');
        }
    }
}

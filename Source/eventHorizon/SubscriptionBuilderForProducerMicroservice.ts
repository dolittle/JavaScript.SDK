// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Observable } from 'rxjs';
import { Guid } from '@dolittle/rudiments';

import { MicroserviceId, TenantId } from '@dolittle/sdk.execution';

import { ISubscriptionBuilderForProducerMicroservice } from './ISubscriptionBuilderForProducerMicroservice';
import { ISubscriptionBuilderForProducerTenant } from './ISubscriptionBuilderForProducerTenant';
import { Subscription } from './Subscription';
import { SubscriptionBuilderForProducerTenant  } from './SubscriptionBuilderForProducerTenant';
import { SubscriptionDefinitionIncomplete } from './SubscriptionDefinitionIncomplete';
import { SubscriptionBuilderMethodAlreadyCalled } from './SubscriptionBuilderMethodAlreadyCalled';
import { SubscriptionCallbackArguments } from './SubscriptionCallbacks';

/**
 * Represents an implementation of {@link ISubscriptionBuilderForProducerMicroservice}.
 */
export class SubscriptionBuilderForProducerMicroservice extends ISubscriptionBuilderForProducerMicroservice {
    private _producerTenantId?: TenantId;
    private _builder?: SubscriptionBuilderForProducerTenant;

    /**
     * Initializes a new instance of the {@link SubscriptionBuilderForProducerMicroservice} class.
     * @param {MicroserviceId} _producerMicroserviceId - The microservice the subscriptions are for.
     */
    constructor(
        private readonly _producerMicroserviceId: MicroserviceId
    ) {
        super();
    }

    /** @inheritdoc */
    fromProducerTenant(tenantId: TenantId | Guid | string): ISubscriptionBuilderForProducerTenant {
        this.throwIfProducerTenantIsAlreadyDefined();
        this._producerTenantId = TenantId.from(tenantId);
        this._builder = new SubscriptionBuilderForProducerTenant(this._producerMicroserviceId, this._producerTenantId);
        return this._builder;
    }

    /**
     * Builds the subscription.
     * @param {Observable<SubscriptionCallbackArguments>} callbackArgumentsSource - The observable source of responses.
     * @returns {Subscription} The built subscription.
     */
    build(callbackArgumentsSource: Observable<SubscriptionCallbackArguments>): Subscription {
        this.throwIfProducerTenantIsNotDefined();
        return this._builder!.build(callbackArgumentsSource);
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

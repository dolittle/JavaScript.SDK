// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Failure } from '@dolittle/sdk.protobuf';
import { Guid } from '@dolittle/rudiments';

import { ConsentId } from './ConsentId';

/**
 * Represents the result from an event horizon subscription request.
 */
export class SubscriptionResponse {

    /**
     * Initializes a new instance of {@link SubscriptionResponse}.
     * @param {ConsentId} consentId - The identifier of the consent.
     * @param {Failure} [failure] - Optional failure details if failed.
     */
    constructor(readonly consentId: ConsentId, readonly failure?: Failure) {
    }

    /**
     * Creates a {@link SubscriptionResponse} from a consent and a potential failure.
     * @param {Guid | string} consentId - The consent identifier for the subscription.
     * @param {Failure} failure - The optional failure that occured during subscription.
     * @returns {SubscriptionResponse} The created subscription response.
     */
    static from(consentId: Guid | string, failure?: Failure): SubscriptionResponse {
        return new SubscriptionResponse(ConsentId.from(consentId), failure);
    }

    /**
     * Gets whether or not the subscription has failed.
     */
    get failed() {
        return !!this.failure;
    }
}

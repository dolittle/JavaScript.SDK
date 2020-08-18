// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Failure } from '@dolittle/sdk.protobuf';
import { ConsentId } from './ConsentId';

/**
 * Represents the result from an event horizon subscription request.
 */
export class SubscriptionResponse {

    /**
     * Initializes a new instance of {@link SubscriptionResponse}.
     * @param {ConsentId} consentId The identifier of the consent.
     * @param {Failure} [failure] Optional failure details if failed.
     */
    constructor(readonly consentId: ConsentId, readonly failure?: Failure) {
    }

    /**
     * Gets whether or not the subscription has failed.
     */
    get failed() {
        return !!this.failure;
    }
}
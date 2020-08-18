// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { TenantId } from '@dolittle/sdk.execution';
import { Subscription } from './Subscription';

/**
 * Represents an event horizon.
 */
export class TenantSubscriptions {

    /**
     * Initializes a new instance of {EventHorizon}.
     * @param {TenantId} tenant The tenant in our microservice.
     * @param {Subscription[]} subscriptions The subscriptions to
     */
    constructor(readonly tenant: TenantId, readonly subscriptions: Subscription[]) {
    }
}

// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';
import { Subscription } from './Subscription';

/**
 * Exception that gets thrown when a subscription does not exist.
 */
export class SubscriptionDoesNotExist extends Exception {

    /**
     * Initializes a new instance of {@link SubscriptionDoesNotExist}.
     * @param {Subscription} subscription - The subscription that does not exist.
     */
    constructor(subscription: Subscription) {
        super(`Subscription from ${subscription.partition} in ${subscription.stream} of ${subscription.tenant} in ${subscription.microservice} into ${subscription.scope} does not exist`);
    }
}

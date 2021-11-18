// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';

/**
 * Exception that gets thrown when a method is called more than once while building an event horizon subscription.
 */
export class SubscriptionBuilderMethodAlreadyCalled extends Exception {
    /**
     * Creates an instance of SubscriptionBuilderMethodAlreadyCalled.
     * @param {string} method - The method that was called more than once.
     */
    constructor(method: string) {
        super(`The method ${method} can only be called once while building an Event Horizon Subscription.`);
    }
}

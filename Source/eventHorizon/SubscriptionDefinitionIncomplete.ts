// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';

/**
 * Exception that gets thrown when trying to build an event horizon subscription that is not completely defined.
 */
export class SubscriptionDefinitionIncomplete extends Exception {
    /**
     * Creates an instance of SubscriptionDefinitionIncomplete.
     * @param {string} missingInformation - The information missing to complete the subscription definition.
     * @param {string} correctingAction - Required action to complete the subscription definition.
     */
    constructor(missingInformation: string, correctingAction: string) {
        super(`Event Horizon Subscription definition is missing ${missingInformation}. ${correctingAction} before calling build()`);
    }
}

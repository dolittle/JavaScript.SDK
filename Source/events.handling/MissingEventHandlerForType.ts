// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';
import { EventType } from '@dolittle/sdk.events';

/**
 * Exception that is thrown when there is no event handler for a specific event type.
 */
export class MissingEventHandlerForType extends Exception {
    /**
     * Initialises a new instance of the {@link MissingEventHandlerForType} class.
     * @param {EventType} eventType - The type that is missing an event handler.
     */
    constructor(eventType: EventType) {
        super(`Missing event handler for '${eventType}'`);
    }
}

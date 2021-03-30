// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { EventType } from '@dolittle/sdk.events';
import { KeySelector } from './';

/**
 * Represents a projection event and key selector.
 */
export class EventSelector {

    /**
     * Initializes a new instance of {@link EventSelector}
     * @param {EventType} eventType The event type to project from.
     * @param {KeySelector} keySelector The key selector to use to select keys from the event type.
     */
    constructor(
        readonly eventType: EventType,
        readonly keySelector: KeySelector) {
    }
}

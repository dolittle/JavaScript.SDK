// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';
import { EventType } from './EventType';

/**
 * Exception that gets thrown when an {@link EventType} is unknown.
 */
export class UnknownType extends Exception {
    /**
     * Initializes a new instance of {@link UnknownEventType}.
     * @param {EventType} eventType Event type that has a missing association.
     */
    constructor(eventType: EventType) {
        super(`'${eventType}' does not have a type associated.`);
    }
}

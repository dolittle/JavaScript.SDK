// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { EventType } from '@dolittle/sdk.events';

/**
 * Represents an uncommitted event that is applied on an aggregate.
 */

export class AppliedEvent {

    /**
     * Initializes a new instance of {@link AppliedEvent}.
     * @param {*} event The event content.
     * @param {EventType} eventType The {@link EventType}.
     * @param {boolean} isPublic Whether the event is public or not.
     */
    constructor(readonly event: any, readonly eventType: EventType, readonly isPublic: boolean) {
    }

    /**
     * Gets whether AppliedEvent has event type explicitly defined or not
     *
     * @returns {Boolean}
     */
    get hasEventType(): boolean {
        return !this.eventType.id.equals(EventType.unspecified);
    }
}

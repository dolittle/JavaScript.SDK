// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { EventTypeId } from './EventTypeId';
import { Generation } from './Generation';

/**
 * Represents the type of an event.
 *
 * @export
 * @class EventType
 */
export class EventType {

    /**
     * Represents an unspecified {@link EventType}
     */
    static readonly unspecified: EventType = new EventType(EventTypeId.from(Guid.empty));

    /**
     * Initializes a new instance of {@link EventType}
     * @param {EventTypeId} id The unique identifier of the event type.
     * @param {Generation} [generation] Optional generation - will default to {@link generation.first}
     */
    constructor(readonly id: EventTypeId, readonly generation: Generation = Generation.first) {
    }

    /** @inheritdoc */
    toString() {
        return `EventType(${this.id}, ${this.generation})`;
    }
}

// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
import { Guid } from '@dolittle/rudiments';
import { Artifact, Generation } from '@dolittle/sdk.artifacts';
import { EventTypeId } from './EventTypeId';

/**
 * Represents the type of an event.
 *
 * @export
 * @class EventType
 */

export class EventType extends Artifact<EventTypeId> {

    /**
     * Represents an unspecified {@link EventType}
     */
    static readonly unspecified: EventType = new EventType(EventTypeId.from(Guid.empty));

    /**
     * Initializes a new instance of {@link EventType}
     * @param {EventTypeId} id The unique identifier of the event type.
     * @param {Generation} [generation] Optional generation - will default to {@link generation.first}
     */
    constructor(id: EventTypeId, generation: Generation = Generation.first) {
        super(id, generation);
    }

    /** @inheritdoc */
    toString() {
        return `EventType(${this.id}, ${this.generation})`;
    }
}

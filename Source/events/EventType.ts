// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { Artifact, Generation, GenerationLike } from '@dolittle/sdk.artifacts';
import { EventTypeAlias } from './EventTypeAlias';
import { EventTypeId, EventTypeIdLike } from './EventTypeId';

/**
 * Represents the type of an event.
 *
 * @export
 * @class EventType
 */
export class EventType extends Artifact<EventTypeId> {
    /**
     * Initializes a new instance of {@link EventType}.
     * @param {EventTypeId} id - The unique identifier of the event type.
     * @param {Generation} [generation] - Optional generation - will default to {@link generation.first}.
     * @param {EventTypeAlias} [alias] - Optional alias.
     */
    constructor(id: EventTypeId, generation: Generation = Generation.first, readonly alias?: EventTypeAlias) {
        super(id, generation);
    }

    /**
     * Gets a value indicating whether there is an alias for the Event Type.
     */
     hasAlias() {
        return this.alias !== undefined;
    }

    /** @inheritdoc */
    toString() {
        return `EventType(${this.id}, ${this.generation})`;
    }

    /**
     * Creates an instance of {@link EventType}.
     * @param id - The Event Type Id.
     * @param generation - The generation of the Event Type.
     * @returns The created {@link EventType}.
     */
    static from(id: EventTypeIdLike, generation?: GenerationLike): EventType {
        if (generation === undefined) {
            generation = Generation.first;
        }

        return new EventType(EventTypeId.from(id), Generation.from(generation));
    }
}

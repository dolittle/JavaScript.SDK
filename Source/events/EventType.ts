// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Artifact, createIsArtifact, Generation, GenerationLike } from '@dolittle/sdk.artifacts';

import { EventTypeAlias, isEventTypeAlias } from './EventTypeAlias';
import { EventTypeId, EventTypeIdLike, isEventTypeId } from './EventTypeId';

/**
 * Represents the type of an event.
 */
export class EventType extends Artifact<EventTypeId> {
    /**
     * Initializes a new instance of {@link EventType} class.
     * @param {EventTypeId} id - The unique identifier of the event type.
     * @param {Generation} [generation] - Optional generation - will default to {@link generation.first}.
     * @param {EventTypeAlias} [alias] - Optional alias.
     */
    constructor(id: EventTypeId, generation: Generation = Generation.first, readonly alias?: EventTypeAlias) {
        super(id, generation);
    }

    /**
     * Gets a value indicating whether there is an alias for the Event Type.
     * @returns {boolean} A value indicating whether there is an alias for the Event Type.
     */
    hasAlias() {
        return this.alias !== undefined;
    }

    /** @inheritdoc */
    toString() {
        return `EventType(${this.id}, ${this.generation})`;
    }

    /**
     * Creates an instance of {@link EventType} from an event type id and generation.
     * @param {EventTypeIdLike} id - The Event Type Id.
     * @param {GenerationLike} generation - The generation of the Event Type.
     * @returns {EventType} The created event type.
     */
    static from(id: EventTypeIdLike, generation?: GenerationLike): EventType {
        if (generation === undefined) {
            generation = Generation.first;
        }

        return new EventType(EventTypeId.from(id), Generation.from(generation));
    }
}

/**
 * Checks whether or not an object is an instance of {@link EventType}.
 * @param {any} object - The object to check.
 * @returns {boolean} True if the object is an {@link EventType}, false if not.
 */
export const isEventType = createIsArtifact(EventType, isEventTypeId, (type) => {
    if (type.alias !== undefined && !isEventTypeAlias(type.alias)) return false;
    if (typeof type.hasAlias !== 'function' || type.hasAlias.length !== 0) return false;
    return true;
});

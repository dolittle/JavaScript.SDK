// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { ConceptAs, createIsConceptAsGuid } from '@dolittle/concepts';

/**
 * Defines the types that can be converted into a {@link EventTypeId}.
 */
export type EventTypeIdLike = Guid | string | EventTypeId;

/**
 * Represents the unique identifier of an event type.
 */
export class EventTypeId extends ConceptAs<Guid, '@dolittle/sdk.events.EventTypeId'> {
    /**
     * Initialises a new instance of the {@link EventTypeId} class.
     * @param {Guid} id - The event type id.
     */
    constructor(id: Guid) {
        super(id, '@dolittle/sdk.events.EventTypeId');
    }

    /**
     * Creates an {@link EventTypeId} from a {@link Guid} or a {@link string}.
     * @param {EventTypeIdLike} id - The event type id.
     * @returns {EventTypeId} The created event type id concept.
     */
    static from(id: EventTypeIdLike): EventTypeId {
        if (isEventTypeId(id)) return id;
        return new EventTypeId(Guid.as(id));
    }
};

/**
 * Checks whether or not an object is an instance of {@link EventTypeId}.
 * @param {any} object - The object to check.
 * @returns {boolean} True if the object is an {@link EventTypeId}, false if not.
 */
export const isEventTypeId = createIsConceptAsGuid(EventTypeId, '@dolittle/sdk.events.EventTypeId');

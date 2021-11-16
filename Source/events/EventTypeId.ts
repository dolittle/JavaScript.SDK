// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { ConceptAs } from '@dolittle/concepts';

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
     * @param {Guid | string} id - The event type id.
     * @returns {EventTypeId} The create event type id concept.
     */
    static from(id: EventTypeIdLike): EventTypeId {
        if (id instanceof EventTypeId) return id;
        return new EventTypeId(Guid.as(id));
    }
};

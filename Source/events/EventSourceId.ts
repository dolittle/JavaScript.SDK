// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ConceptAs } from '@dolittle/concepts';
import { Guid } from '@dolittle/rudiments';

/**
 * Defines the types that can be converted into a {@link EventSourceId}.
 */
export type EventSourceIdLike = Guid | string | EventSourceId;

/**
 * Represents the unique identifier of an event source.
 */
export class EventSourceId extends ConceptAs<string, '@dolittle/sdk.events.EventSourceId'> {
    /**
     * Initialises a new instance of the {@link EventSourceId} class.
     * @param {string} id - The event source id.
     */
    constructor(id: string) {
        super(id, '@dolittle/sdk.events.EventSourceId');
    }

    /**
     * Generates a new {@link EventSourceId} with a new random unique identifier.
     * @returns {EventSourceId} The generated event source id.
     */
    static new(): EventSourceId {
        return new EventSourceId(Guid.create().toString());
    }

    /**
     * Creates an {@link EventSourceId} from a {@link Guid} or a {@link string}.
     * @param {EventSourceIdLike} id - The event source id.
     * @returns {EventSourceId} The created event source id concept.
     */
    static from(id: EventSourceIdLike): EventSourceId {
        if (id instanceof EventSourceId) return id;
        return new EventSourceId(id.toString());
    }
};

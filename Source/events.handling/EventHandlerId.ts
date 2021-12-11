// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ConceptAs } from '@dolittle/concepts';
import { Guid } from '@dolittle/rudiments';

/**
 * Represents the unique identifier for a EventHandler.
 */
export class EventHandlerId extends ConceptAs<Guid, '@dolittle/sdk.events.handling.EventHandlerId'> {
    /**
     * Initialises a new instance of the {@link EventHandlerId} class.
     * @param {Guid} id - The event handler id.
     */
    constructor(id: Guid) {
        super(id, '@dolittle/sdk.events.handling.EventHandlerId');
    }

    /**
     * Creates an {@link EventHandlerId} from a {@link Guid} or a {@link string}.
     * @param {string | Guid | EventHandlerId} id - The event handler id.
     * @returns {EventHandlerId} The created event handler id concept.
     */
    static from(id: string | Guid | EventHandlerId): EventHandlerId {
        if (id instanceof EventHandlerId) return id;
        return new EventHandlerId(Guid.as(id));
    }
}

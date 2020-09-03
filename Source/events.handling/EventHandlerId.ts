// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ConceptAs } from '@dolittle/concepts';
import { Guid } from '@dolittle/rudiments';

/**
 * Represents the unique identifier for a EventHandler.
 */
export class EventHandlerId extends ConceptAs<Guid, '@dolittle/sdk.events.handling.EventHandlerId'> {
    constructor(id: Guid) {
        super(id, '@dolittle/sdk.events.handling.EventHandlerId');
    }

    /**
     * Creates an {EventHandlerId} from a guid.
     *
     * @static
     * @param {string | Guid | EventHandlerId} id
     * @returns {EventHandlerId}
     */
    static from(id: string | Guid | EventHandlerId): EventHandlerId {
        if (id instanceof EventHandlerId) {
            return id;
        }

        return new EventHandlerId(Guid.as(id));
    }
}

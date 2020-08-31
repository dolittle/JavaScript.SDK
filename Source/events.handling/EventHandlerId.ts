// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { ConceptAs } from '@dolittle/concepts';

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
     * @param {(Guid | string)} id
     * @returns {EventHandlerId}
     */
    static from(id: Guid | string): EventHandlerId {
        return new EventHandlerId(Guid.as(id));
    }
}

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

    static create(id?: Guid | string): EventHandlerId {
        return new EventHandlerId(id != null ? Guid.as(id) : Guid.create());
    }
}

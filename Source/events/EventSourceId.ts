// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ConceptAs } from '@dolittle/concepts';
import { Guid } from '@dolittle/rudiments';

/**
 * Represents the unique identifier of an event source.
 *
 * @export
 * @class EventSourceId
 * @augments {ConceptAs<string, '@dolittle/sdk.events.EventSourceId'>}
 */
export class EventSourceId extends ConceptAs<string, '@dolittle/sdk.events.EventSourceId'> {
    constructor(id: string) {
        super(id, '@dolittle/sdk.events.EventSourceId');
    }

    /**
     * Create a new {@link EventSourceId} with a new unique identifier.
     * @returns {EventSourceId}
     */
    static new(): EventSourceId {
        return new EventSourceId(Guid.create().toString());
    }

    /**
     * Creates an {EventSourceId} from a guid.
     *
     * @static
     * @param {EventSourceId | Guid | string)} id
     * @returns {EventSourceId}
     */
    static from(id: EventSourceId | Guid | string): EventSourceId {
        if (id instanceof EventSourceId) return id;
        return new EventSourceId(id.toString());
    }
};

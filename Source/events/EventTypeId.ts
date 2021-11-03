// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { ConceptAs } from '@dolittle/concepts';

export type EventTypeIdLike = Guid | string | EventTypeId;

/**
 * Represents the unique identifier of an event type.
 *
 * @export
 * @class EventTypeId
 * @extends {ConceptAs<Guid, '@dolittle/sdk.artifacts.EventTypeId'>}
 */
export class EventTypeId extends ConceptAs<Guid, '@dolittle/sdk.events.EventTypeId'> {
    constructor(id: Guid) {
        super(id, '@dolittle/sdk.events.EventTypeId');
    }
    /**
     * Creates an {@link EventTypeId} from a guid.
     *
     * @static
     * @param {(Guid | string)} id
     * @returns {EventSourceId}
     */
    static from(id: EventTypeIdLike): EventTypeId {
        if (id instanceof EventTypeId) return id;
        return new EventTypeId(Guid.as(id));
    }
};

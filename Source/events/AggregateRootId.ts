// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { ConceptAs } from '@dolittle/concepts';

/**
 * Represents the unique identifier of an event type.
 *
 * @export
 * @class AggregateRootId
 * @extends {ConceptAs<Guid, '@dolittle/sdk.events.AggregateRootId'>}
 */
export class AggregateRootId extends ConceptAs<Guid, '@dolittle/sdk.events.AggregateRootId'> {
    constructor(id: Guid) {
        super(id, '@dolittle/sdk.events.AggregateRootId');
    }
    /**
     * Creates an {@link AggregateRootId} from a guid.
     *
     * @static
     * @param {(Guid | string)} id
     * @returns {EventSourceId}
     */
    static from(id: Guid | string | AggregateRootId): AggregateRootId {
        if (id instanceof AggregateRootId) return id;
        return new AggregateRootId(Guid.as(id));
    }
};

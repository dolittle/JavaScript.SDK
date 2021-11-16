// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { ConceptAs } from '@dolittle/concepts';

/**
 * Defines the types that can be converted into a {@link AggregateRootId}.
 */
export type AggregateRootIdLike = Guid | string | AggregateRootId;

/**
 * Represents the unique identifier of an event type.
 */
export class AggregateRootId extends ConceptAs<Guid, '@dolittle/sdk.events.AggregateRootId'> {
    /**
     * Initialises a new instance of the {@link AggregateRootId} class.
     * @param {Guid} id - The aggregate root id.
     */
    constructor(id: Guid) {
        super(id, '@dolittle/sdk.events.AggregateRootId');
    }
    /**
     * Creates an {@link AggregateRootId} from a {@link AggregateRootIdLike}.
     * @param {AggregateRootIdLike} id - The aggregate root id.
     * @returns {AggregateRootId} The created aggregate root id concept.
     */
    static from(id: AggregateRootIdLike): AggregateRootId {
        if (id instanceof AggregateRootId) return id;
        return new AggregateRootId(Guid.as(id));
    }
};

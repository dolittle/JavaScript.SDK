// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { ConceptAs, createIsConceptAsGuid } from '@dolittle/concepts';

/**
 * Represents the unique identifier for a Filter.
 */
export class FilterId extends ConceptAs<Guid, '@dolittle/sdk.events.filtering.FilterId'> {
    /**
     * Initialises a new instance of the {@link FilterId} class.
     * @param {Guid} id - The filter id.
     */
    constructor(id: Guid) {
        super(id, '@dolittle/sdk.events.filtering.FilterId');
    }

    /**
     * Creates a {@link FilterId} from a {@link Guid} or a {@link string}.
     * @param {Guid | string} id - The filter id.
     * @returns {FilterId} The created filter id concept.
     */
    static from(id: string | Guid | FilterId): FilterId {
        if (id instanceof FilterId) return id;
        return new FilterId(Guid.as(id));
    }
}

/**
 * Checks whether or not an object is an instance of {@link FilterId}.
 * @param {any} object - The object to check.
 * @returns {boolean} True if the object is an {@link FilterId}, false if not.
 */
export const isFilterId = createIsConceptAsGuid(FilterId, '@dolittle/sdk.events.filtering.FilterId');

// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { ConceptAs } from '@dolittle/concepts';

/**
 * Represents the unique identifier for a Filter.
 */
export class FilterId extends ConceptAs<Guid, '@dolittle/sdk.events.filtering.FilterId'> {
    constructor(id: Guid) {
        super(id, '@dolittle/sdk.events.filtering.FilterId');
    }

    /**
     * Creates a {FilterId} from a guid.
     *
     * @static
     * @param {(Guid | string)} id
     * @returns {FilterId}
     */
    static from(id: Guid | string): FilterId {
        return new FilterId(Guid.as(id));
    }
}

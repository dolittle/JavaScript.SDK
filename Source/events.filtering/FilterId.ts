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

    static create(id?: Guid | string): FilterId {
        return new FilterId(id != null ? Guid.as(id) : Guid.create());
    }
}

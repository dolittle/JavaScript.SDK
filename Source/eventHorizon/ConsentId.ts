// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { ConceptAs } from '@dolittle/concepts';

/**
 * Represents the unique identifier for a consent.
 */
export class ConsentId extends ConceptAs<Guid, '@dolittle/sdk.eventhorizon.ConsentId'> {
    /**
     * Initialises a new instance of the {@link ConsentId} class.
     * @param {Guid} id - The consent id.
     */
    constructor(id: Guid) {
        super(id, '@dolittle/sdk.eventhorizon.ConsentId');
    }

    /**
     * Creates a {@link ConsentId} from a {@link Guid} or a {@link string}.
     * @param {string | Guid} id - The consent id.
     * @returns {ConsentId} The created consent id concept.
     */
    static from(id: string | Guid | ConsentId): ConsentId {
        if (id instanceof ConsentId) return id;
        return new ConsentId(Guid.as(id));
    };
}

// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { ConceptAs } from '@dolittle/concepts';

/**
 * Represents the unique identifier for a consent.
 */
export class ConsentId extends ConceptAs<Guid, '@dolittle/sdk.eventhorizon.ConsentId'> {
    constructor(id: Guid) {
        super(id, '@dolittle/sdk.eventhorizon.ConsentId');
    }

    /**
     * Creates a {ConsentId} from a guid.
     *
     * @static
     * @param {(string | Guid)} id
     * @returns {ConsentId}
     */
    static from(id: string | Guid): ConsentId {
        return new ConsentId(Guid.as(id));
    };
}

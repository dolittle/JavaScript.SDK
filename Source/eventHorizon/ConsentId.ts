// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { ConceptAs } from '@dolittle/concepts';

/**
 * Represents the unique identifier for a consent.
 */
export class ConsentId extends ConceptAs<Guid, '@dolittle/sdk.eventhorizon'> {
    constructor(id: Guid) {
        super(id, '@dolittle/sdk.eventhorizon');
    }

    static create(id: string | Guid): ConsentId {
        return new ConsentId(id != null? Guid.as(id) : Guid.create());
    };
}

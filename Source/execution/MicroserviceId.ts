// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { ConceptAs } from '@dolittle/concepts';

/**
 * Represents the unique identifier for a Microservice.
 */

export class MicroserviceId extends ConceptAs<Guid, '@dolittle/sdk.execution.MicroserviceId'> {
    constructor(id: Guid) {
        super(id, '@dolittle/sdk.execution.MicroserviceId');
    }

    /**
     * Represents the identifier for when Microservice is not applicable.
     */
    static notApplicable = MicroserviceId.from(Guid.empty);

    /**
     * Creates a {MicroserviceId} from a guid.
     *
     * @static
     * @param {(string | Guid)} id
     * @returns {MicroserviceId}
     */
    static from(id: string | Guid | MicroserviceId): MicroserviceId {
        if (id instanceof MicroserviceId) return id;
        return new MicroserviceId(Guid.as(id));
    };
}

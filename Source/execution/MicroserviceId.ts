// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { ConceptAs } from '@dolittle/concepts';

/**
 * Represents the unique identifier for a Microservice.
 */
export class MicroserviceId extends ConceptAs<Guid, '@dolittle/sdk.execution.MicroserviceId'> {
    /**
     * Initialises a new instance of the {@link MicroserviceId} class.
     * @param {Guid} id - The microservice id.
     */
    constructor(id: Guid) {
        super(id, '@dolittle/sdk.execution.MicroserviceId');
    }

    /**
     * Represents the identifier for when Microservice is not applicable.
     */
    static notApplicable = MicroserviceId.from(Guid.empty);

    /**
     * Creates a {@link MicroserviceId} from a {@link string} or a {@link Guid}.
     * @param {string | Guid | MicroserviceId} id - The microservice id.
     * @returns {MicroserviceId} The created microservice id concept.
     */
    static from(id: string | Guid | MicroserviceId): MicroserviceId {
        if (id instanceof MicroserviceId) return id;
        return new MicroserviceId(Guid.as(id));
    };
}

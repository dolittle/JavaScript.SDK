// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ConceptAs } from '@dolittle/concepts';
import { Guid } from '@dolittle/rudiments';

/**
 * Represents the unique identifier of a Projection.
 */
export class ProjectionId extends ConceptAs<Guid, '@dolittle/sdk.projections.ProjectionId'> {
    /**
     * Initialises a new instance of the {@link ProjectionId} class.
     * @param {Guid} id - The projection id.
     */
    constructor(id: Guid) {
        super(id, '@dolittle/sdk.projections.ProjectionId');
    }

    /**
     * Creates a {ProjectionId} from a guid.
     * @param {string | Guid | ProjectionId} id - The projection id.
     * @returns {ProjectionId} The created projection id concept.
     */
    static from(id: string | Guid | ProjectionId): ProjectionId {
        if (id instanceof ProjectionId) return id;
        return new ProjectionId(Guid.as(id));
    }
}

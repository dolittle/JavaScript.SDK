// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { ConceptAs } from '@dolittle/concepts';

/**
 * Represents the unique identifier for an artifact.
 */
export class ArtifactId extends ConceptAs<Guid, '@dolittle/sdk.artifacts.ArtifactId'> {
    constructor(id: Guid) {
        super(id, '@dolittle/sdk.artifacts.ArtifactId');
    }

    /**
     * Creates a new {ArtifactId}.
     *
     * @static
     * @returns {ArtifactId}
     */
    static new(): ArtifactId {
        return ArtifactId.from(Guid.create());
    }

    /**
     * Creates an {ArtifactId} from a guid.
     *
     * @static
     * @param {(Guid | string)} id
     * @returns {ArtifactId}
     */
    static from(id: Guid | string | ArtifactId): ArtifactId {
        if (id instanceof ArtifactId) return id;
        return new ArtifactId(Guid.as(id));
    }
};

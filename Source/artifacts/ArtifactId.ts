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
    static create(id?: Guid | string): ArtifactId {
        return new ArtifactId(id != null ? Guid.as(id) : Guid.create());
    }
};

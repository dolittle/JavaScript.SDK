// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ConceptAs } from '@dolittle/concepts';
import { Guid } from '@dolittle/rudiments';

import { Artifact } from '../../Artifact';
import { Artifacts } from '../../Artifacts';
import { Generation } from '../../Generation';

export class artifact_type_id extends ConceptAs<Guid, 'artifact_type_id'> {
    constructor(id: Guid) {
        super(id, 'artifact_type_id');
    }
    static from(id: Guid | string | artifact_type_id): artifact_type_id {
        if (id instanceof artifact_type_id) return id;
        return new artifact_type_id(Guid.as(id));
    }
};

export class artifact_type extends Artifact<artifact_type_id> {
    constructor(id: artifact_type_id, generation: Generation = Generation.first) {
        super(id, generation);
    }

    toString() {
        return `artifact_type_id(${this.id}, ${this.generation})`;
    }
}

export class artifacts extends Artifacts<artifact_type, artifact_type_id> {
    constructor() {
        super(artifact_type);
    }

    protected createArtifactFrom(id: string | Guid | artifact_type_id): artifact_type {
        return id instanceof artifact_type ? id : new artifact_type(artifact_type_id.from(id));
    }
}

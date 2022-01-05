// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ConceptAs } from '@dolittle/concepts';
import { Guid } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

import { Artifact } from '../../Artifact';
import { ArtifactOrId } from '../../IArtifacts';
import { Artifacts } from '../../Artifacts';
import { Generation } from '../../Generation';
import { ArtifactTypeMap } from '../../ArtifactTypeMap';

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

export class artifact_type_map<TType> extends ArtifactTypeMap<artifact_type, artifact_type_id, TType> {
    protected createArtifact(id: string, generation: Generation): artifact_type {
        return new artifact_type(artifact_type_id.from(id), generation);
    }

    get [Symbol.toStringTag]() {
        return 'artifact_type_map';
    }
}

export class artifacts extends Artifacts<artifact_type, artifact_type_id> {
    protected artifactTypeName = 'artifacts';

    constructor(map: artifact_type_map<Constructor<any>> = new artifact_type_map()) {
        super(map);
    }
    protected createArtifact(artifactOrId: ArtifactOrId<artifact_type, artifact_type_id>): artifact_type {
        return artifactOrId instanceof artifact_type
                ? artifactOrId
                : new artifact_type(artifact_type_id.from(artifactOrId));
    }
}

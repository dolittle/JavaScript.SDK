// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ConceptAs } from '@dolittle/concepts';
import { Guid } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

import { Artifact, isArtifact } from './Artifact';
import { IArtifacts, ArtifactOrId } from './IArtifacts';
import { TypeMap } from './Mappings/TypeMap';

/**
 * Represents an implementation of {@link IArtifacts}.
 * @template TArtifact The artifact type to map to a type.
 * @template TId The id type of the artifact.
 */
export abstract class Artifacts<TArtifact extends Artifact<TId>, TId extends ConceptAs<Guid, string>> extends TypeMap<TArtifact, [string, number]> implements IArtifacts<TArtifact, TId> {

    /**
     * Initialises a new instance of the {@link Artifacts} class.
     * @param {Constructor} artifactType - The type of the artifact.
     */
    constructor(
        artifactType: Constructor<TArtifact>
    ) {
        super(artifactType, artifact => [artifact.id.value.toString(), artifact.generation.value], 2);
    }

    /** @inheritdoc */
    resolveFrom(object: any, input?: ArtifactOrId<TArtifact, TId>): TArtifact {
        if (isArtifact(input)) {
            return super.resolveFrom(object, input);
        }

        if (input !== undefined) {
            const artifact = this.createArtifactFrom(input);
            return super.resolveFrom(object, artifact);
        }

        return super.resolveFrom(object);
    }

    /**
     * Creates an artifact from an id.
     * @param {TId | Guid | string} id - The artifact id to create from.
     */
    protected abstract createArtifactFrom(id: TId | Guid | string): TArtifact;
}

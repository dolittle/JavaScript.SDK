// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ConceptAs } from '@dolittle/concepts';
import { Guid } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

import { ComplexValueMap } from './Mappings/ComplexValueMap';
import { Artifact } from './Artifact';

/**
 * Represents a map for mapping an {@link Artifact} to a value.
 * @template TArtifact The type of the artifact to use as key.
 * @template TId The type of the artifact id.
 * @template V The type of the value.
 */
export class ArtifactMap<TArtifact extends Artifact<TId>, TId extends ConceptAs<Guid, string>, V> extends ComplexValueMap<TArtifact, V, [string, number]> {
    /**
     * Initialises a new instance of the {@link ArtifactMap} class.
     * @param {Constructor} artifactType - The type of the artifact.
     */
    constructor(
        artifactType: Constructor<TArtifact>
    ) {
        super(artifactType, artifact => [artifact.id.value.toString(), artifact.generation.value], 2);
    }
}

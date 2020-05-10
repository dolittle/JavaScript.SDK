// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ArtifactId } from './ArtifactId';
import { IArtifacts } from './IArtifacts';
import { Artifact } from './Artifact';
import { Artifacts } from './Artifacts';

/**
 * Represents a builder for building {IArtifacts} instances
 */
export class ArtifactsBuilder {
    private _artifactsMap: Map<Function, Artifact> = new Map();

    /**
     * Associate a type with a unique artifact identifier and optional generation.
     * @param {Function} type Type to associate.
     * @param {ArtifactId} identifier Identifier to associate with.
     * @param {number} generation Optional generation - defaults to 1.
     */
    associateType(type: Function, identifier: ArtifactId, generation: number = 1): ArtifactsBuilder {
        this._artifactsMap.set(type, {id: identifier, generation: generation});
        return this;
    }

    /**
     * Build an artifacts instance.
     * @returns {IArtifacts} Artifacts to work with.
     */
    build(): IArtifacts {
        const artifacts = new Artifacts(this._artifactsMap);
        return artifacts;
    }
}
// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';
import { ArtifactId, Artifact, Artifacts, IArtifacts, Generation } from './index';
import { Guid } from '@dolittle/rudiments';

export type ArtifactsBuilderCallback = (builder: ArtifactsBuilder) => void;

/**
 * Represents a builder for building {@link IArtifacts} instances
 */
export class ArtifactsBuilder {
    private _artifactsMap: Map<Constructor<any>, Artifact> = new Map();

    /**
     * Associate a type with a unique artifact identifier and optional generation.
     * @param {Constructor} type Type to associate.
     * @param {ArtifactId} identifier Identifier to associate with.
     * @param {number} generation Optional generation - defaults to 1.
     */
    associate(type: Constructor<any>, identifier: string | Guid | ArtifactId, generation = Generation.first): ArtifactsBuilder {
        this._artifactsMap.set(type, new Artifact(ArtifactId.from(identifier), generation));
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

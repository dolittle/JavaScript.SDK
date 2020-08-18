// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Artifact } from './Artifact';
import { ArtifactId } from './ArtifactId';
import { UnableToResolveArtifact } from './UnableToResolveArtifact';
import { Constructor } from '@dolittle/rudiments';

/**
 * Defines the system for working with {Artifact}
 */
export interface IArtifacts {

    /**
     * Check if there is a type associated with an artifact.
     * @param {Artifact | ArtifactId} input Artifact or artifactId.
     * @returns {boolean} true if there is, false if not.
     */
    hasTypeFor(input: Artifact | ArtifactId): boolean;

    /**
     * Get type for a given {@link Artifact} or {@link ArtifactId};
     * @param {Artifact | ArtifactId} input Artifact or artifactId.
     * @returns type for artifact.
     */
    getTypeFor(input: Artifact | ArtifactId): Constructor<any>;

    /**
     * Check if there is an {Artifact} definition for a given type.
     * @param {Function} type Type to check for.
     * @returns true if there is, false if not.
     */
    hasFor(type: Constructor<any>): boolean;

    /**
     * Get {Artifact} definition for a given type.
     * @param {Function} type Type to get for.
     * @returns {Artifact} The artifact associated.
     */
    getFor(type: Constructor<any>): Artifact;

    /**
     * Resolves an artifact from optional input or the given object.
     * @param object Object to resolve for.
     * @param [input] Optional input as an artifact or representations of artifacts as identifier.
     * @returns {Artifact} resolved artifacts.
     * @throws {UnableToResolveArtifact} If not able to resolve artifact.
     */
    resolveFrom(object: any, input?: Artifact | ArtifactId): Artifact;

    /**
     * Associate a type with a unique artifact identifier and optional generation.
     * @param {Constructor<any>} type Type to associate.
     * @param {ArtifactId} identifier Identifier to associate with.
     * @param {number} generation Optional generation - defaults to 1.
     */
    associate(type: Constructor<any>, identifier: ArtifactId, generation?: number): void;
}

// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ConceptAs } from '@dolittle/concepts';
import { Guid } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

import { Artifact } from './Artifact';

/**
 * Represents a reference to an artifact through the artifact itself or just the id.
 */
export type ArtifactOrId<TArtifact extends Artifact<TId>, TId extends ConceptAs<Guid, string>> = TArtifact | TId | Guid | string;

/**
 * Defines the system for working with artifacts.
 * @template TArtifact The type of the artifact.
 * @template TId The id type of the artifact.
 */
export abstract class IArtifacts<TArtifact extends Artifact<TId>, TId extends ConceptAs<Guid, string>> {
    /**
     * Gets all artifacts.
     * @returns {TArtifact[]} All artifacts associated with a type.
     */
    abstract getAll(): TArtifact[];

    /**
     * Check if there is a type associated with an artifact.
     * @param {TArtifact} input - Artifact.
     * @returns {boolean} True if there is, false if not.
     */
    abstract hasTypeFor(input: TArtifact): boolean;

    /**
     * Get type for a given artifact.
     * @param {TArtifact} input - Artifact.
     * @returns {Constructor<any>} Type for artifact.
     */
    abstract getTypeFor(input: TArtifact): Constructor<any>;

    /**
     * Check if there is an artifact associated with a given type.
     * @param {Constructor<any>} type - Type to check for.
     * @returns {boolean} True if there is, false if not.
     */
    abstract hasFor(type: Constructor<any>): boolean;

    /**
     * Get the artifact associated with a given type.
     * @param {Constructor<any>} type - Type to get for.
     * @returns {TArtifact} The artifact associated.
     */
    abstract getFor(type: Constructor<any>): TArtifact;

    /**
     * Resolves an artifact from optional input or the given object.
     * @param {any} object - Object to resolve for.
     * @param {ArtifactOrId<TArtifact, TId>} [input] - Optional input as an artifact or representations of artifacts as identifier.
     * @returns {TArtifact} Resolved artifact.
     */
    abstract resolveFrom(object: any, input?: ArtifactOrId<TArtifact, TId>): TArtifact;

    /**
     * Associate a type with an artifact.
     * @param {Constructor<any>} type - Type to associate.
     * @param {TArtifact} artifact - Artifact to associate with.
     */
    abstract associate(type: Constructor<any>, artifact: TArtifact): void;
}

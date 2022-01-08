// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ConceptAs } from '@dolittle/concepts';
import { Guid } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

import { ITypeMap } from './Mappings/ITypeMap';
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
export abstract class IArtifacts<TArtifact extends Artifact<TId>, TId extends ConceptAs<Guid, string>> implements ITypeMap<TArtifact> {
    /**
     * Check if there is an artifact associated with a given type.
     * @param {Constructor} type - Type to check for.
     * @returns {boolean} True if there is, false if not.
     */
    abstract hasFor(type: Constructor<any>): boolean;

    /**
     * Get the artifact associated with a given type.
     * @param {Constructor} type - Type to get artifact for.
     * @returns {TArtifact} The artifact associated with the type.
     */
    abstract getFor(type: Constructor<any>): TArtifact;

    /**
     * Gets all the artifacts that is associated with a type.
     * @returns {TArtifact[]} All associated artifacts type.
     */
    abstract getAll(): TArtifact[];

    /**
     * Check if there is a type associated with a given artifact.
     * @param {TArtifact} artifact - Key to check for.
     * @returns {boolean} True if there is, false if not.
     */
    abstract hasTypeFor(artifact: TArtifact): boolean;

    /**
     * Get the type associated with a given artifact.
     * @param {TArtifact} artifact - Key to get type for.
     * @returns {Constructor<any>} The type associated with the artifact.
     */
    abstract getTypeFor(artifact: TArtifact): Constructor<any> ;

    /**
     * Gets all the artifacts that is associated with a type.
     * @returns {Constructor[]} All associated artifacts type.
     */
    abstract getAllTypes(): Constructor<any>[];

    /**
     * Resolves a artifact from optional input or the given object.
     * @param {any} object - Object to resolve for.
     * @param {TArtifact} [input] - Optional input artifact.
     * @returns {TArtifact} Resolved artifact.
     */
    abstract resolveFrom(object: any, input?: ArtifactOrId<TArtifact, TId>): TArtifact;

    /**
     * Associate a type with a artifact.
     * @param {Constructor} type - The type to associate.
     * @param {TArtifact} artifact - The artifact to associate with.
     */
    abstract associate(type: Constructor<any>, artifact: TArtifact): void;
}

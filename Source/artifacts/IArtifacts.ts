// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
import { Guid } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';
import { Artifact, ArtifactIdLike } from './Artifact';

export type ArtifactOrId<TArtifact extends Artifact<TId>, TId extends ArtifactIdLike> = TArtifact | TId | Guid | string;

/**
 * Defines the system for working with {@link Artifact}
 */
export abstract class IArtifacts<TArtifact extends Artifact<TId>, TId extends ArtifactIdLike> {

    /**
     * Gets all artifacts.
     */
    abstract getAll (): TArtifact[];

    /**
     * Check if there is a type associated with an artifact.
     * @param {TArtifact} input Artifact.
     * @returns {boolean} true if there is, false if not.
     */
    abstract hasTypeFor (input: TArtifact): boolean;

    /**
     * Get type for a given artifact.
     * @param {TArtifact} input Artifact.
     * @returns type for artifact.
     */
    abstract getTypeFor (input: TArtifact): Constructor<any>;

    /**
     * Check if there is an {Artifact} definition for a given type.
     * @param {Function} type Type to check for.
     * @returns true if there is, false if not.
     */
    abstract hasFor (type: Constructor<any>): boolean;

    /**
     * Get {Artifact} definition for a given type.
     * @param {Function} type Type to get for.
     * @returns {TArtifact} The artifact associated.
     */
    abstract getFor (type: Constructor<any>): TArtifact;

    /**
     * Resolves an artifact from optional input or the given object.
     * @param object Object to resolve for.
     * @param [input] Optional input as an artifact or representations of artifacts as identifier.
     * @returns {TArtifact} Resolved event type.
     * @throws {UnableToResolveArtifact} If not able to resolve artifact.
     */
    abstract resolveFrom (object: any, input?: ArtifactOrId<TArtifact, TId>): TArtifact;

    /**
     * Associate a type with a unique artifact identifier and optional generation.
     * @param {Constructor<any>} type Type to associate.
     * @param {TArtifact} eventType Artifact to associate with.
     */
    abstract associate (type: Constructor<any>, eventType: TArtifact): void;
}

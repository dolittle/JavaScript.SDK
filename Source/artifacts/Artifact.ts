// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid, IEquatable, isGuid } from '@dolittle/rudiments';

import { Generation, isGeneration } from './Generation';

/**
 * Defines the types that can be used as artifact identifiers.
 */
export type ArtifactIdLike = { value: Guid };

/**
 * Represents the base representation of an Artifact.
 * @template TId The artifact identifier type.
 */
export abstract class Artifact<TId extends ArtifactIdLike> implements IEquatable {

    /**
     * Initializes a new instance of {@link EventType}.
     * @param {TId} id - The unique identifier of the artifact.
     * @param {Generation} [generation] - Optional generation - will default to {@link generation.first}.
     */
    constructor(readonly id: TId, readonly generation: Generation = Generation.first) {
    }

    /** @inheritdoc */
    equals(other: any): boolean {
        if (isArtifact(other)) {
            return this.id.value.equals(other.id.value) && this.generation.equals(other.generation);
        }
        return false;
    }

    /** @inheritdoc */
    abstract toString(): string;
}

/**
 * Checks whether or not an object is an instance of {@link Artifact}.
 * @param {any} object - The object to check.
 * @returns {boolean} True if the object is an {@link Artifact}, false if not.
 */
export const isArtifact = (object: any): object is Artifact<ArtifactIdLike> => {
    if (typeof object !== 'object' || object === null) return false;

    const { id, generation, equals, toString } = object;
    if (typeof id !== 'object' || id === null || !isGuid(id.value)) return false;
    if (!isGeneration(generation)) return false;
    if (typeof equals !== 'function' || equals.length !== 1) return false;
    if (typeof toString !== 'function' || toString.length !== 0) return false;

    return true;
};

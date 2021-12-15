// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid, IEquatable } from '@dolittle/rudiments';
import { Generation } from './Generation';

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
        if (other instanceof Artifact) {
            return this.id.value.equals(other.id.value) && this.generation.equals(other.generation);
        }
        return false;
    }

    /** @inheritdoc */
    abstract toString(): string;

}

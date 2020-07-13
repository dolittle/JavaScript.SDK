// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { ArtifactId } from './ArtifactId';
import { ArtifactsFromDecorators } from './ArtifactsFromDecorators';

/**
 * Defines an artifact. An artifact represents typically a type in the system in an runtime agnostic way.
 *
 * An artifact is represented with a unique identifier and can also be versioned through the concept of
 * generation.
 */
export class Artifact {
    readonly id: Guid;
    readonly generation: number;

    /**
     * Initializes a new instance of {@link Artifact}
     * @param id The artifact id.
     * @param [generation] The generation number
     */
    constructor(id: ArtifactId, generation = 1) {
        this.id = Guid.as(id);
        this.generation = generation;
    }

    toString() {
        return `[${this.id} - ${this.generation}]`;
    }
}
/**
 * Decorator for associating a type with an artifact.
 */
export function artifact(identifier: ArtifactId, generation = 1) {
    return function (target: any) {
        ArtifactsFromDecorators.associate(target.prototype.constructor, identifier, generation);
    };
}

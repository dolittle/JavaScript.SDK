// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import {
    Generation,
    ArtifactId,
    ArtifactsFromDecorators
} from './index';

/**
 * Defines an artifact. An artifact represents typically a type in the system in a runtime agnostic way.
 *
 * An artifact is represented with a unique identifier and can also be versioned through the concept of
 * generation.
 */
export class Artifact {

    /**
     * The artifact id.
     *
     * @type {ArtifactId}
     */
    readonly id: ArtifactId;

    /**
     * The generation number.
     *
     * @type {Generation}
     */
    readonly generation: Generation;

    /**
     * Initializes a new instance of {@link Artifact}
     * @param id The artifact id.
     * @param [generation] The generation number
     */
    constructor(id: ArtifactId, generation = Generation.first) {
        this.id = id;
        this.generation = generation;
    }

    toString() {
        return `[${this.id.toString()} - ${this.generation.toString()}]`;
    }
}

/**
 * Decorator for associating a type with an artifact.
 */
export function artifact(identifier: ArtifactId, generation = Generation.first) {
    return function (target: any) {
        ArtifactsFromDecorators.associate(target.prototype.constructor, identifier, generation);
    };
}

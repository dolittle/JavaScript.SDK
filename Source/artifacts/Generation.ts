// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ConceptAs } from '@dolittle/concepts';
import { GenerationMustBePositiveInteger } from './GenerationMustBePositiveInteger';

/**
 * Defines the types that can be converted into a {@link Generation}.
 */
export type GenerationLike = Generation | number;

/**
 * Represents the generation of an Artifact.
 */
export class Generation extends ConceptAs<number, '@dolittle/sdk.artifacts.Generation'>{

    /**
     * Initialises a new instance of the {@link Generation} class.
     * @param {number} generation - The generation.
     */
    constructor(generation: number) {
        if (!Number.isSafeInteger(generation) || generation < 0) throw new GenerationMustBePositiveInteger();
        super(generation, '@dolittle/sdk.artifacts.Generation');
    }

    /**.
     * Represents the first {@link Generation}
     */
    static first: Generation = Generation.from(1);

    /**
     * Creates a {@link Generation} from a {@link GenerationLike}.
     * @param {GenerationLike} generation - The generation.
     * @returns {Generation} The created generation concept.
     */
    static from(generation: GenerationLike): Generation {
        if (generation instanceof Generation) return generation;
        return new Generation(generation);
    }
}

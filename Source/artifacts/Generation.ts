// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ConceptAs } from '@dolittle/concepts';
import { GenerationMustBePositiveInteger } from './GenerationMustBePositiveInteger';

/**
 * Represents the generation of an Artifact.
 *
 * @export
 * @class Generation
 * @extends {ConceptAs<number, '@dolittle/sdk.artifacts.Generation'>}
 */
export class Generation extends ConceptAs<number, '@dolittle/sdk.artifacts.Generation'>{

    constructor(generation: number) {
        if (!Number.isSafeInteger(generation) && generation < 0) throw new GenerationMustBePositiveInteger();
        super(generation, '@dolittle/sdk.artifacts.Generation');
    }

    /**
     * Represents the first {Generation}
     *
     * @static
     * @type {Generation}
     */
    static first: Generation = Generation.from(1);

    /**
     * Creates a {Generation} from a number.
     *
     * @static
     * @param {Generation | number} generation
     * @returns {Generation}
     */
    static from(generation: Generation | number): Generation {
        if (generation instanceof Generation) return generation;
        return new Generation(generation);
    }
}

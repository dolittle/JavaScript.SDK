// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import isNaturalNumber from 'is-natural-number';
import { ConceptAs } from '@dolittle/concepts';
import { GenerationMustBeNaturalNumber } from './GenerationMustBeNaturalNumber';

/**
 * Represents the generation of an Artifact.
 *
 * @export
 * @class Generation
 * @extends {ConceptAs<number, '@dolittle/sdk.artifacts.Generation'>}
 */
export class Generation extends ConceptAs<number, '@dolittle/sdk.artifacts.Generation'>{

    constructor(generation: number) {
        if (!isNaturalNumber(generation, { includeZero: true })) throw new GenerationMustBeNaturalNumber();
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
     * @param {number} num
     * @returns {Generation}
     */
    static from(num: number): Generation {
        return new Generation(num);
    }
}

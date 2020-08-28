// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ConceptAs, fromConceptFor } from '@dolittle/concepts';
import { GenerationCannotBeLessThanZero } from './index';

export class Generation extends ConceptAs<number, '@dolittle/sdk.artifacts.Generation'>{
    constructor(generation: number) {
        if (generation == null || generation < 0) throw new GenerationCannotBeLessThanZero();
        super(generation, '@dolittle/sdk.artifacts.Generation');
    }

    static first: Generation = new Generation(1);
    static as(generation: number): Generation {
        return generation != null ? new Generation(generation) : Generation.first;
    }
}

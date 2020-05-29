// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ArtifactId } from './ArtifactId';
import { Guid } from '@dolittle/rudiments';

export class Artifact {
    readonly id: Guid;
    readonly generation: number;

    constructor(id: ArtifactId, generation: number) {
        this.id = Guid.as(id);
        this.generation = generation;
    }
}

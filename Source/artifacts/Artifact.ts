// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { ArtifactId } from './ArtifactId';
import { ArtifactsFromDecorators } from './ArtifactsFromDecorators';

export class Artifact {
    readonly id: Guid;
    readonly generation: number;

    constructor(id: ArtifactId, generation: number) {
        this.id = Guid.as(id);
        this.generation = generation;
    }
}

export function artifact(identifier: ArtifactId, generation = 1) {
    return function (target: any) {
        ArtifactsFromDecorators.associate(target.prototype.constructor, identifier, generation);
    };
}

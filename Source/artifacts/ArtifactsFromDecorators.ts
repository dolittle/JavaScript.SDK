// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ReplaySubject } from 'rxjs';
import { ArtifactId } from './ArtifactId';
import { Artifact } from './Artifact';
import { ArtifactAssociation } from './ArtifactAssociation';
import { Constructor } from '@dolittle/rudiments';

/**
 * Represents artifacts coming from decorators.
 */
export class ArtifactsFromDecorators {
    static readonly artifacts: ReplaySubject<ArtifactAssociation> = new ReplaySubject<ArtifactAssociation>();

    /**
     * Associate a type with a unique artifact identifier and optional generation.
     * @param {Constructor} type Type to associate.
     * @param {ArtifactId} identifier Identifier to associate with.
     * @param {number} generation Optional generation - defaults to 1.
     */
    static associate(type: Constructor<any>, identifier: ArtifactId, generation?: number): void {
        this.artifacts.next(new ArtifactAssociation(type, new Artifact(identifier, generation || 1)));
    }
}

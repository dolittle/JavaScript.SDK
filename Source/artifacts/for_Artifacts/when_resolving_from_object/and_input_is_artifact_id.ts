// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import no_associations from '../given/no_associations';
import { ArtifactId } from '../../index';

describe('when resolving from object and input is artifact id', () => {
    const artifactId = ArtifactId.create('ec0111e1-84e4-4d1a-b7f3-a2f6c4427609');
    const result = no_associations.artifacts.resolveFrom({}, artifactId);

    it('should return artifact with the identifier', () => result.id.equals(artifactId).should.be.true);
    it('should return artifact with first generation', () => result.generation.value.should.equal(1));
});

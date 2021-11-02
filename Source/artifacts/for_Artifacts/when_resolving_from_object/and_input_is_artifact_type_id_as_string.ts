// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import no_associations from '../given/no_associations';
import { Generation } from '../../Generation';
import { artifact_type_id } from '../given/artifacts';

describe('when resolving from object and input is artifact type id as string', () => {
    const artifactTypeId = 'ec0111e1-84e4-4d1a-b7f3-a2f6c4427609';
    const result = no_associations.artifacts.resolveFrom({}, artifactTypeId);
    it('should return event type with the identifier', () => result.id.equals(artifact_type_id.from(artifactTypeId)).should.be.true);
    it('should return event type with first generation', () => result.generation.should.equal(Generation.first));
});

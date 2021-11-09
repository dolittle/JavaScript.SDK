// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import no_associations from '../given/no_associations';
import { Generation } from '../../Generation';
import { artifact_type_id } from '../given/artifacts';

import { describeThis } from '@dolittle/typescript.testing';

describeThis(__filename, () => {
    const id = artifact_type_id.from('ec0111e1-84e4-4d1a-b7f3-a2f6c4427609');
    const result = no_associations.artifacts.resolveFrom({}, id);

    it('should return artifact with the identifier', () => result.id.equals(id).should.be.true);
    it('should return artifact with first generation', () => result.generation.should.equal(Generation.first));
});

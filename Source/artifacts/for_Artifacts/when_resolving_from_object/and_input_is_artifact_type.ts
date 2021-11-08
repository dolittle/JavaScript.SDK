// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { artifact_type, artifact_type_id } from '../given/artifacts';
import no_associations from '../given/no_associations';

import { describeThis } from '@dolittle/typescript.testing';

describeThis(__filename, () => {
    const artifact = new artifact_type(artifact_type_id.from('ec0111e1-84e4-4d1a-b7f3-a2f6c4427609'));
    const result = no_associations.artifacts.resolveFrom({}, artifact);

    it('should return same as input', () => result.should.equal(artifact));
});

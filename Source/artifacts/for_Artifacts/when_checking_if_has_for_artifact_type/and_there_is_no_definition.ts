// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import no_associations from '../given/no_associations';
import { artifact_type, artifact_type_id } from '../given/artifacts';

import { describeThis } from '@dolittle/typescript.testing';

describeThis(__filename, () => {
    const result = no_associations.artifacts.hasTypeFor(new artifact_type(artifact_type_id.from('7d47a28b-7b87-4b7b-93f7-2d6ce6d56f7b')));

    it('should not have it', () => result.should.be.false);
});

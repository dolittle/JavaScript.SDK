// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Generation } from '@dolittle/sdk.artifacts';
import '../artifacts';
import { artifact_type, artifact_type_id } from './given/artifact_type';

import { describeThis } from '@dolittle/typescript.testing';

describeThis(__filename, () => {
    const artifactTypeId = '5e865826-abd5-43b8-b6a2-589be9e9d1f5';
    const generation = 42;
    const artifactType = new artifact_type(artifact_type_id.from(artifactTypeId), Generation.from(generation));
    const result = artifactType.toProtobuf().toSDK(artifact_type.from);

    it('should have same identifier as original', () => result.id.equals(artifactType.id).should.be.true);
    it('should have same generation as original', () => result.generation.equals(artifactType.generation).should.be.true);
});

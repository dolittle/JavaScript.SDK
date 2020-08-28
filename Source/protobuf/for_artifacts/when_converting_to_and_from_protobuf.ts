// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Artifact, ArtifactId, Generation } from '@dolittle/sdk.artifacts';
import { Guid } from '@dolittle/rudiments';
import '../index';

describe('when converting to and from protobuf', () => {
    const artifactId = '5e865826-abd5-43b8-b6a2-589be9e9d1f5';
    const generation = 42;
    const artifact = Artifact.from(artifactId, generation);
    const result = artifact.toProtobuf().toSDK();

    it('should have same identifier as original', () => result.id.equals(artifact.id).should.be.true);
    it('should have same generation as original', () => result.generation.equals(artifact.generation).should.be.true);
});

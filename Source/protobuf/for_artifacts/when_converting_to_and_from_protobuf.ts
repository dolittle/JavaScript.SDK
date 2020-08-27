// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Artifact, ArtifactId, Generation } from '@dolittle/sdk.artifacts';
import { Guid } from '@dolittle/rudiments';
import '../index';

describe('when converting to and from protobuf', () => {
    const artifact = new Artifact(ArtifactId.create(), Generation.create(42));
    const result = artifact.toProtobuf().toSDK();

    it('should have same identifier as original', () => result.id.equals(artifact.id).should.be.true);
    it('should have same generation as original', () => result.generation.equals(artifact.generation).should.be.true);
});

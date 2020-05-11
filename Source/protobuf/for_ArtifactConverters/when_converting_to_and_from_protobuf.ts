// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Artifact, ArtifactId } from '@dolittle/sdk.artifacts';
import '../ArtifactConverters';

describe('when converting to and from protobuf', () => {
    const artifact = new Artifact(ArtifactId.create(), 42);
    const result = artifact.toProtobuf().toSDK();

    it('should have same identifier as original', () => result.id.toString().should.be.equal(artifact.id.toString()));
    it('should have same generation as original', () => result.generation.should.be.equal(artifact.generation));
});

// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Artifact as PbArtifact } from '@dolittle/contracts/Artifacts/Artifact_pb';

import { MissingArtifactIdentifier } from '..';

describe('when converting from protobuf with missing id', () => {
    const pbArtifact = new PbArtifact();
    pbArtifact.setGeneration(42);

    let result: any;

    try {
        pbArtifact.toSDK();
    } catch (ex) {
        result = ex;
    }

    it('should throw missing artifact identifier', () => result.should.be.instanceOf(MissingArtifactIdentifier));
});

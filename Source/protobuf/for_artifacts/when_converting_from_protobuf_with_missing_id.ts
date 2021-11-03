// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Artifact as PbArtifact } from '@dolittle/contracts/Artifacts/Artifact_pb';

import { MissingArtifactIdentifier } from '..';
import { artifact_type, artifact_type_id } from './given/artifact_type';

describe('when converting from protobuf with missing id', () => {
    const pbArtifact = new PbArtifact();
    pbArtifact.setGeneration(42);

    let result: any;

    try {
        pbArtifact.toSDK(artifact_type.from);
    } catch (ex) {
        result = ex;
    }

    it('should throw missing artifact identifier', () => result.should.be.instanceOf(MissingArtifactIdentifier));
});

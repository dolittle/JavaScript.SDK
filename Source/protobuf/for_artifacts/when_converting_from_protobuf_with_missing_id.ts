// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Artifact as PbArtifact } from '@dolittle/contracts/Artifacts/Artifact_pb';

import '../artifacts';
import { MissingArtifactIdentifier } from '../MissingArtifactIdentifier';
import { artifact_type } from './given/artifact_type';

import { describeThis } from '@dolittle/typescript.testing';

describeThis(__filename, () => {
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

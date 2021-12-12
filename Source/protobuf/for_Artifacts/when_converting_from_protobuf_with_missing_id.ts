// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { describeThis } from '@dolittle/typescript.testing';

import { Artifact as PbArtifact } from '@dolittle/contracts/Artifacts/Artifact_pb';

import { toSDK } from '../Artifacts';
import { MissingArtifactIdentifier } from '../MissingArtifactIdentifier';

import { artifact_type } from './given/artifact_type';

describeThis(__filename, () => {
    const pbArtifact = new PbArtifact();
    pbArtifact.setGeneration(42);

    let result: any;

    try {
        toSDK(pbArtifact, artifact_type.from);
    } catch (ex) {
        result = ex;
    }

    it('should throw missing artifact identifier', () => result.should.be.instanceOf(MissingArtifactIdentifier));
});

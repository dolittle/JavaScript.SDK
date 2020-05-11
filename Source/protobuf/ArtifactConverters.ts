// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Artifact } from '@dolittle/sdk.artifacts';
import { Artifact as PbArtifact } from '@dolittle/runtime.contracts/Fundamentals/Artifacts/Artifact_pb';

import { toProtobuf as guidToProtobuf } from './GuidConverters';

declare module '@dolittle/sdk.artifacts' {
    interface Artifact {
        toProtobuf(): PbArtifact;
    }
}

Artifact.prototype.toProtobuf = function () {
    const artifact = new PbArtifact();
    artifact.setId(guidToProtobuf(this.id));
    artifact.setGeneration(this.generation);
    return artifact;
};

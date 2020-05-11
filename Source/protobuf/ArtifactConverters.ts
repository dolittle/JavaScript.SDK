// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Artifact as SdkArtifact, ArtifactId } from '@dolittle/sdk.artifacts';
import { Artifact as PbArtifact } from '@dolittle/runtime.contracts/Fundamentals/Artifacts/Artifact_pb';

import { toProtobuf as guidToProtobuf } from './GuidConverters';

import { MissingArtifactIdentifier } from './MissingArtifactIdentifier';

declare module '@dolittle/sdk.artifacts' {
    interface Artifact {
        toProtobuf(): PbArtifact;
    }
}

/**
 * Convert to protobuf representation
 */
SdkArtifact.prototype.toProtobuf = function () {
    const artifact = new PbArtifact();
    artifact.setId(guidToProtobuf(this.id));
    artifact.setGeneration(this.generation);
    return artifact;
};

declare module '@dolittle/runtime.contracts/Fundamentals/Artifacts/Artifact_pb' {
    interface Artifact {
        toSDK(): SdkArtifact
    }
}

/**
 * Convert to SDK representation
 */
PbArtifact.prototype.toSDK = function () {
    const uuid = this.getId()?.getValue_asU8();
    if (!uuid) {
        throw new MissingArtifactIdentifier();
    }
    return new SdkArtifact(new ArtifactId(uuid), this.getGeneration());
};

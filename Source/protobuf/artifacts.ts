// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Artifact as SdkArtifact, ArtifactId } from '@dolittle/sdk.artifacts';
import { Artifact as PbArtifact } from '@dolittle/runtime.contracts/Fundamentals/Artifacts/Artifact_pb';

import guids from './guids';

import { MissingArtifactIdentifier } from './MissingArtifactIdentifier';

/**
 * Convert to protobuf representation
 * @returns {PbArtifact}
 */
function toProtobuf(input: SdkArtifact): PbArtifact {
    const artifact = new PbArtifact();
    artifact.setId(guids.toProtobuf(input.id));
    artifact.setGeneration(input.generation);
    return artifact;
}

/**
 * Convert to SDK representation
 * @returns {SdkArtifact}
 */
function toSDK(input: PbArtifact): SdkArtifact {
    const uuid = input.getId()?.getValue_asU8();
    if (!uuid) {
        throw new MissingArtifactIdentifier();
    }
    return new SdkArtifact(new ArtifactId(uuid), input.getGeneration());
}

export default {
    toProtobuf: toProtobuf,
    toSDK: toSDK
};

declare module '@dolittle/sdk.artifacts' {
    interface Artifact {
        toProtobuf(): PbArtifact;
    }
}

/**
 * Convert to protobuf representation
 * @returns {PbArtifact}
 */
SdkArtifact.prototype.toProtobuf = function () {
    return toProtobuf(this);
};

declare module '@dolittle/runtime.contracts/Fundamentals/Artifacts/Artifact_pb' {
    interface Artifact {
        toSDK(): SdkArtifact
    }
}

/**
 * Convert to SDK representation
 * @returns {SdkArtifact}
 */
PbArtifact.prototype.toSDK = function () {
    return toSDK(this);
};

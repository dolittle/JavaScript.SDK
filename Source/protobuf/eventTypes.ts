// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { EventType, EventTypeId, Generation } from '@dolittle/sdk.artifacts';
import { Artifact as PbArtifact } from '@dolittle/contracts/Artifacts/Artifact_pb';

import { MissingArtifactIdentifier } from './MissingArtifactIdentifier';
import guids from './guids';

/**
 * Convert to protobuf representation
 * @returns {PbArtifact}
 */
function toProtobuf(input: EventType): PbArtifact {
    const artifact = new PbArtifact();
    artifact.setId(guids.toProtobuf(input.id.value));
    artifact.setGeneration(input.generation.value);
    return artifact;
}

/**
 * Convert to SDK representation
 * @returns {EventType}
 */
function toSDK(input?: PbArtifact): EventType {
    if (!input) {
        throw new MissingArtifactIdentifier();
    }
    const uuid = input.getId()?.getValue_asU8();
    if (!uuid) {
        throw new MissingArtifactIdentifier();
    }
    return new EventType(EventTypeId.from(new Guid(uuid)), Generation.from(input.getGeneration()));
}

export default {
    toProtobuf,
    toSDK
};

declare module '@dolittle/sdk.artifacts' {
    interface EventType {
        toProtobuf(): PbArtifact;
    }
}

/**
 * Convert to protobuf representation
 * @returns {PbArtifact}
 */
EventType.prototype.toProtobuf = function () {
    return toProtobuf(this);
};

declare module '@dolittle/contracts/Artifacts/Artifact_pb' {
    interface Artifact {
        toSDK(): EventType
    }
}

/**
 * Convert to SDK representation
 * @returns {SdkArtifact}
 */
PbArtifact.prototype.toSDK = function () {
    return toSDK(this);
};

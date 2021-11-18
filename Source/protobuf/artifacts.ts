// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { Artifact as SdkArtifact, ArtifactIdLike, Generation } from '@dolittle/sdk.artifacts';
import { Artifact as PbArtifact } from '@dolittle/contracts/Artifacts/Artifact_pb';

import { MissingArtifactIdentifier } from './MissingArtifactIdentifier';
import guids from './guids';

/**
 * Convert to protobuf representation.
 * @param {TArtifact} input - The artifact to convert.
 * @returns {PbArtifact} The converted artifact.
 * @template TArtifact The type of the artifact.
 * @template TId The type of the artifact id.
 */
function toProtobuf<TArtifact extends SdkArtifact<TId>, TId extends ArtifactIdLike>(input: TArtifact): PbArtifact {
    const artifact = new PbArtifact();
    artifact.setId(guids.toProtobuf(input.id.value));
    artifact.setGeneration(input.generation.value);
    return artifact;

}

/**
 * Convert to SDK representation.
 * @param {PbArtifact | undefined} input - The artifact to convert.
 * @param {(Guid, Generation) => TArtifact} artifactFactory - The callback to use to construct the converted artifact type.
 * @returns {TArtifact} The converted artifact.
 * @template TArtifact The type of the artifact.
 * @template TId The type of the artifact id.
 */
function toSDK<TArtifact extends SdkArtifact<TId>, TId extends ArtifactIdLike>(input: PbArtifact | undefined, artifactFactory: (id: Guid, generation: Generation) => TArtifact): TArtifact {
    if (!input) {
        throw new MissingArtifactIdentifier();
    }
    const uuid = input.getId()?.getValue_asU8();
    if (!uuid) {
        throw new MissingArtifactIdentifier();
    }
    return artifactFactory(new Guid(uuid), Generation.from(input.getGeneration()));
}

export default {
    toProtobuf,
    toSDK
};

declare module '@dolittle/sdk.artifacts' {
    interface Artifact<TId> {
        toProtobuf(): PbArtifact;
    }
}

/**
 * Convert to protobuf representation.
 * @returns {PbArtifact} The converted artifact.
 */
 SdkArtifact.prototype.toProtobuf = function () {
    return toProtobuf(this);
};

declare module '@dolittle/contracts/Artifacts/Artifact_pb' {
    interface Artifact {
        toSDK<TArtifact extends SdkArtifact<TId>, TId extends ArtifactIdLike>(artifactFactory: (id: Guid, generation: Generation) => TArtifact): TArtifact
    }
}

/**
 * Convert to SDK representation.
 * @param {(Guid, Generation) => TArtifact} artifactFactory - The callback to use to construct the converted artifact type.
 * @returns {TArtifact} The converted artifact.
 * @template TArtifact The type of the artifact.
 * @template TId The type of the artifact id.
 */
PbArtifact.prototype.toSDK = function<TArtifact extends SdkArtifact<TId>, TId extends ArtifactIdLike> (artifactFactory: (id: Guid, generation: Generation) => TArtifact) {
    return toSDK(this, artifactFactory);
};

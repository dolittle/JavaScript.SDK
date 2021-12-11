// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';

import { Artifact as SdkArtifact, ArtifactIdLike, Generation } from '@dolittle/sdk.artifacts';

import { Artifact as PbArtifact } from '@dolittle/contracts/Artifacts/Artifact_pb';

import { MissingArtifactIdentifier } from './MissingArtifactIdentifier';

import './extensions';
import './guids';

/**
 * Convert to protobuf representation.
 * @param {TArtifact} input - The artifact to convert.
 * @returns {PbArtifact} The converted artifact.
 * @template TArtifact The type of the artifact.
 * @template TId The type of the artifact id.
 */
export function toProtobuf<TArtifact extends SdkArtifact<TId>, TId extends ArtifactIdLike>(input: TArtifact): PbArtifact {
    const artifact = new PbArtifact();
    artifact.setId(input.id.value.toProtobuf());
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
export function toSDK<TArtifact extends SdkArtifact<TId>, TId extends ArtifactIdLike>(input: PbArtifact | undefined, artifactFactory: (id: Guid, generation: Generation) => TArtifact): TArtifact {
    if (!input) {
        throw new MissingArtifactIdentifier();
    }
    const guid = input.getId()?.toSDK();
    if (!guid) {
        throw new MissingArtifactIdentifier();
    }
    return artifactFactory(guid, Generation.from(input.getGeneration()));
}

SdkArtifact.prototype.toProtobuf = function () {
    return toProtobuf(this);
};

PbArtifact.prototype.toSDK = function<TArtifact extends SdkArtifact<TId>, TId extends ArtifactIdLike> (artifactFactory: (id: Guid, generation: Generation) => TArtifact) {
    return toSDK(this, artifactFactory);
};

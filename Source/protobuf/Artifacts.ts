// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';

import { Artifact as SdkArtifact, ArtifactIdLike, Generation } from '@dolittle/sdk.artifacts';

import { Artifact as PbArtifact } from '@dolittle/contracts/Artifacts/Artifact_pb';

import * as Guids from './Guids';
import { MissingArtifactIdentifier } from './MissingArtifactIdentifier';

/**
 * Convert an artifact to protobuf representation.
 * @param {TArtifact} input - The artifact to convert.
 * @returns {PbArtifact} The converted artifact.
 * @template TArtifact The type of the artifact.
 * @template TId The type of the artifact id.
 */
export function toProtobuf<TArtifact extends SdkArtifact<TId>, TId extends ArtifactIdLike>(input: TArtifact): PbArtifact {
    const artifact = new PbArtifact();
    artifact.setId(Guids.toProtobuf(input.id.value));
    artifact.setGeneration(input.generation.value);
    return artifact;

}

/**
 * Convert an artifact to SDK representation.
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
    const uuid = input.getId();
    if (!uuid) {
        throw new MissingArtifactIdentifier();
    }
    return artifactFactory(Guids.toSDK(uuid), Generation.from(input.getGeneration()));
}

// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';
import { Artifact, ArtifactIdLike } from './Artifact';

/**
 * Exception that gets thrown when an type is associated with multiple artifacts.
 * @template TArtifact The type of the artifact.
 */
export class CannotHaveMultipleArtifactsAssociatedWithType<TArtifact extends Artifact<TId>, TId extends ArtifactIdLike> extends Exception {
    /**
     * Initialises a new instance of the {@link CannotHaveMultipleArtifactsAssociatedWithType} class.
     * @param {Constructor<any>} type - The type that already associated with an artifact.
     * @param {TArtifact} artifact - The artifact that was attempted to associate with.
     * @param {TArtifact} associatedArtifact - The artifact that the type was already associated with.
     */
    constructor(type: Constructor<any>, artifact: TArtifact, associatedArtifact: TArtifact) {
        super(`${type.name} cannot be associated with ${artifact} because it is already associated with ${associatedArtifact}`);
    }
}

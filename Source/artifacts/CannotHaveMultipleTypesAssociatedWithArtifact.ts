// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';
import { Artifact, ArtifactIdLike } from './Artifact';

/**
 * Exception that gets thrown when an artifact is associated with multiple types.
 * @template TArtifact The type of the artifact.
 */
export class CannotHaveMultipleTypesAssociatedWithArtifact<TArtifact extends Artifact<TId>, TId extends ArtifactIdLike> extends Exception {
    /**
     * Initialises a new instance of the {@link CannotHaveMultipleTypesAssociatedWithArtifact} class.
     * @param {TArtifact} artifact - The artifact that was already associated with at type.
     * @param {Constructor<any>} type - The type that was attempted to associate with.
     * @param {Constructor<any>} associatedType - The type that the artifact was already associated with.
     */
    constructor(artifact: TArtifact, type: Constructor<any>, associatedType: Constructor<any>) {
        super(`${artifact} cannot be associated with ${type.name} because it is already associated with ${associatedType}`);
    }
}

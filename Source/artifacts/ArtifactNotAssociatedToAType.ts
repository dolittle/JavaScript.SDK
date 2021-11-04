// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';
import { Artifact, ArtifactIdLike } from './Artifact';

/**
 * Exception that gets thrown when getting the type associated with an artifact and the artifact is not associated to any type.
 */
export class ArtifactNotAssociatedToAType<TArtifact extends Artifact<TId>, TId extends ArtifactIdLike> extends Exception {
    /**
     * Initializes a new instance of {@link ArtifactNotAssociatedToAType}.
     * @param {TArtifact} artifact Artifact that has a missing association.
     */
    constructor(artifact: TArtifact) {
        super(`'${artifact}' does not have a type associated.`);
    }
}

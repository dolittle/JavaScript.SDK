// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';
import { Artifact, ArtifactIdLike } from './Artifact';

/**
 * Exception that gets thrown when an {@link Constructor{T}} is associated with multiple artifacts.
 *
 * @export
 * @class CannotHaveMultipleArtifactsAssociatedWithType
 * @augments {Exception}
 */
export class CannotHaveMultipleArtifactsAssociatedWithType<TArtifact extends Artifact<TId>, TId extends ArtifactIdLike> extends Exception {
    /**
     * @param type
     * @param artifact
     * @param associatedArtifact
     */
    constructor(type: Constructor<any>, artifact: TArtifact, associatedArtifact: TArtifact) {
        super(`${type.name} cannot be associated with ${artifact} because it is already associated with ${associatedArtifact}`);
    }
}

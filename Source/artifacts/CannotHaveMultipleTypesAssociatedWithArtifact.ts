// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';
import { Artifact, ArtifactIdLike } from './Artifact';

/**
 * Exception that gets thrown when an artifact is associated with multiple types.
 *
 * @export
 * @class CannotHaveMultipleTypesAssociatedWithArtifact
 * @extends {Exception}
 */
export class CannotHaveMultipleTypesAssociatedWithArtifact<TArtifact extends Artifact<TId>, TId extends ArtifactIdLike> extends Exception {
    constructor(artifact: TArtifact, type: Constructor<any>, associatedType: Constructor<any>) {
        super(`${artifact} cannot be associated with ${type.name} because it is already associated with ${associatedType}`);
    }
}
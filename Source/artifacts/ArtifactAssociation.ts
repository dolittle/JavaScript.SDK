// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Artifact } from './Artifact';

/**
 * Represents an association between a type and an artifact.
 */
export class ArtifactAssociation {

    /**
     * Initializes a new instance of {ArtifactAssociation}.
     * @param {Function} type Type to associate.
     * @param {Artifact} artifact Artifact associated with the type.
     */
    constructor(readonly type: Function, readonly artifact: Artifact) {
    }
}

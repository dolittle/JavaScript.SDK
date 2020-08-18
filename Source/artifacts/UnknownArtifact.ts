// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Artifact } from './Artifact';

/**
 * Exception that gets thrown when an {@link Artifact} is unknown.
 */
export class UnknownArtifact extends Error {
    /**
     * Initializes a new instance of {@link UnknownArtifact}.
     * @param {Function} type Type that has a missing association.
     */
    constructor(type: Function) {
        super(`'${type.name}' does not have an artifact association.`);
    }
}

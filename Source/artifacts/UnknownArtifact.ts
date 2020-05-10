// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

/**
 * Exception that gets thrown when an {Artifact} is unknown.
 */
export class UnknownArtifact extends Error {
    /**
     * Initializes a new instance of {UnknownArtifact}.
     * @param {Function} type Type that has a missing association.
     */
    constructor(type: Function) {
        super(`'${type.name}' does not have an artifact association.`);
    }
}

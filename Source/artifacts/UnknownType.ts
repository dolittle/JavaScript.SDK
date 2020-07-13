// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Artifact } from './Artifact';

/**
 * Exception that gets thrown when an {Artifact} is unknown.
 */
export class UnknownType extends Error {
    /**
     * Initializes a new instance of {@link UnknownType}.
     * @param {Artifact} artifact Artifact that has a missing association.
     */
    constructor(artifact: Artifact) {
        super(`'${artifact}' does not have a type associated.`);
    }
}

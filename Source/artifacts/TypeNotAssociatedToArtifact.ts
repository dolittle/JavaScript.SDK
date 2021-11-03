// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';

/**
 * Exception that gets thrown when getting artifact associated with a type and type is not associated to any artifact .
 */
export class TypeNotAssociatedToArtifact extends Exception {
    /**
     * Initializes a new instance of {@link TypeNotAssociatedToEventType}.
     * @param {string} artifactTypeName The name of the artifact type.
     * @param {Function} type Type that has a missing association.
     */
    constructor(artifactTypeName: string, type: Function) {
        super(`'${type.name}' does not have an ${artifactTypeName} association.`);
    }
}

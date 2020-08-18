// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Artifact } from './Artifact';
import { Exception } from '@dolittle/rudiments';

/**
 * Exception that is thrown when an {@link Artifact} is not possible to be resolved
 */
export class UnableToResolveArtifact extends Exception {

    /**
     * Initializes a new instance of {@link UnknownEventType}
     * @param {Function} type Type of event that is unknown.
     * @param {*} [input] Optionally the input that was given
     */
    constructor(type: Function, input?: any) {
        let message = `'${type.name}' does not have an associated artifact identifier.`;
        if (input) {
            message = `${message}. Following input '${input}' was given in addition.`;
        }
        super(message);
    }
}

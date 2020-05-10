// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

/**
 * Exception that is thrown when an event type (Artifact Type) is unknown
 */
export class UnknownEventType extends Error {

    /**
     * Initializes a new instance of {UnknownEventType}
     * @param {Function} type Type of event that is unknown.
     */
    constructor(type: Function) {
        super(`'${type.name}' does not have an associated artifact identifier.`);
    }
}

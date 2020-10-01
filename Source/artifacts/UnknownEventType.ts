// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';

/**
 * Exception that gets thrown when an {@link EventType} is unknown.
 */
export class UnknownEventType extends Exception {
    /**
     * Initializes a new instance of {@link UnknownEventType}.
     * @param {Function} type Type that has a missing association.
     */
    constructor(type: Function) {
        super(`'${type.name}' does not have an event type association.`);
    }
}

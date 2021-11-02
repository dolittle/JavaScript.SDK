// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';

/**
 * Exception that gets thrown when getting {@link EventType} associated with a type and type is not associated to any {@link EventType} .
 */
export class TypeNotAssociatedToEventType extends Exception {
    /**
     * Initializes a new instance of {@link TypeNotAssociatedToEventType}.
     * @param {Function} type Type that has a missing association.
     */
    constructor(type: Function) {
        super(`'${type.name}' does not have an event type association.`);
    }
}

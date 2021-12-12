// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { eventType } from './eventTypeDecorator';

/**
 * Exception that gets thrown when registering an event class that is not decorated with the eventType decorator.
 */
export class ClassNotDecoratedWithEventType extends Error {
    /**
     * Initialises a new instance of the {@link ClassNotDecoratedWithEventType} class.
     * @param {string} className - The name of the class that is not decorated.
     */
    constructor(className: string) {
        super(`The class ${className} is not decorated with the @${eventType.name} decorator. Classes used as events must be decorated.`);
    }
}

// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { eventType } from './eventTypeDecorator';

/**
 * The exception that gets thrown when the eventType decorator is applied multiple times to the same class.
 */
export class EventTypeDecoratorAppliedMultipleTimes extends Error {
    /**
     * Initialises a new instance of the {@link EventTypeDecoratorAppliedMultipleTimes} class.
     * @param {string} className - The name of the class that has the decorator applied multiple times.
     */
    constructor(className: string) {
        super(`The class ${className} has the @${eventType.name} decorator applied multiple times. Only one is allowed.`);
    }
}

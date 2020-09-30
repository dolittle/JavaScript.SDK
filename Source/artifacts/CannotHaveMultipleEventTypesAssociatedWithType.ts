// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';
import { EventType } from './EventType';

/**
 * Exception that gets thrown when an {@link Constructor{T}} is associated with multiple event types.
 *
 * @export
 * @class CannotHaveMultipleTypesAssociatedWithEventType
 * @extends {Exception}
 */
export class CannotHaveMultipleEventTypesAssociatedWithType extends Exception {
    constructor(type: Constructor<any>, eventType: EventType, associatedEventType: EventType) {
        super(`${type} cannot be associated with ${eventType} because it is already associated with ${associatedEventType}`);
    }
}
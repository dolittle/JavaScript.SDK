// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';
import { EventType } from './EventType';


/**
 * Exception that gets thrown when an {@link EventType} is associated with multiple types.
 *
 * @export
 * @class CannotHaveMultipleTypesAssociatedWithEventType
 * @extends {Exception}
 */
export class CannotHaveMultipleTypesAssociatedWithEventType extends Exception {
    constructor(eventType: EventType, type: Constructor<any>, associatedType: Constructor<any>) {
        super(`${eventType} cannot be associated with ${type.name} because it is already associated with ${associatedType}`);
    }
}
// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';

/**
 * The exception that gets thrown when a event types is not set and is expected.
 */

/**
 *
 */
export class EventTypesNotSet extends Exception {
    /**
     *
     */
    constructor() {
        super('Event types is not set on the Aggregate Root. Aggregate Roots must be constructed through the Client.');
    }
}

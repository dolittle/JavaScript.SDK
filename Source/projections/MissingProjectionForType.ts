// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';
import { EventType } from '@dolittle/sdk.artifacts';

/**
 * Exception that is thrown when there is no projection for a specific event type.
 */
export class MissingProjectionForType extends Exception {
    constructor(eventType: EventType) {
        super(`Missing projection for '${eventType}'`);
    }
}

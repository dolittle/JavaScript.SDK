// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';
import { EventType } from '@dolittle/sdk.events';

import { ProjectionId } from './ProjectionId';

/**
 * Exception that is thrown when there is no projection for a specific event type.
 */
export class MissingOnMethodForType extends Exception {
    constructor(projectionId: ProjectionId, eventType: EventType) {
        super(`Missing on() method for ${eventType} in projection ${projectionId}`);
    }
}

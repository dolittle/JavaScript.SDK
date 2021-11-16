// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';
import { EventType } from '@dolittle/sdk.events';

import { ProjectionId } from './ProjectionId';

/**
 * Exception that is thrown when there is no on() method for a specific event type on a projection.
 */
export class MissingOnMethodForType extends Exception {
    /**
     * Initialises a new instance of the {@link MissingOnMethodForType} class.
     * @param {ProjectionId} projectionId - The projection that is missing the on() method.
     * @param {EventType} eventType - The event type that the method is missing for.
     */
    constructor(projectionId: ProjectionId, eventType: EventType) {
        super(`Missing on() method for ${eventType} in projection ${projectionId}`);
    }
}

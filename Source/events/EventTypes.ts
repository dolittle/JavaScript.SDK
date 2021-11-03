// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';
import { ArtifactOrId } from '@dolittle/sdk.artifacts';
import { EventType } from './EventType';
import { EventTypeId } from './EventTypeId';
import { EventTypeMap } from './EventTypeMap';
import { IEventTypes } from './IEventTypes';

/**
 * Represents an implementation of {@link IEventTypes}
 */
export class EventTypes extends IEventTypes {
    /**
     * Initializes a new instance of {@link EventTypes}
     * @param {EventTypeMap<Constructor<any>>} [associations] Known associations
     */
    constructor(associations: EventTypeMap<Constructor<any>> = new EventTypeMap()) {
        super(associations);
    }
    /** @inheritdoc */
    protected createArtifact(artifactOrId: ArtifactOrId<EventType, EventTypeId>): EventType {
        return artifactOrId instanceof EventType
                ? artifactOrId
                : new EventType(EventTypeId.from(artifactOrId));
    }
}

// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';

import { EventType } from './EventType';
import { EventTypeId } from './EventTypeId';
import { IEventTypes } from './IEventTypes';

/**
 * Represents an implementation of {@link IEventTypes}.
 */
export class EventTypes extends IEventTypes {
    /**
     * Initialises a new instance of the {@link EventTypes} class.
     */
    constructor() {
        super(EventType);
    }

    /** @inheritdoc */
    protected createArtifactFrom(id: string | EventTypeId | Guid): EventType {
        return EventType.from(id);
    }
}

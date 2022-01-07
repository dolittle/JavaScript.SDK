// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ArtifactMap } from '@dolittle/sdk.artifacts';

import { EventType } from './EventType';
import { EventTypeId } from './EventTypeId';

/**
 * Represents a map for mapping an event type to a given type.
 * @template T Type to map to.
 */
export class EventTypeMap<T> extends ArtifactMap<EventType, EventTypeId, T> {
    /**
     * Initialises a new instance of the {@link EventTypeMap} class.
     */
    constructor() {
        super(EventType);
    }
}

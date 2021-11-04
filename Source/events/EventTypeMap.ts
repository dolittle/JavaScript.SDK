// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ArtifactTypeMap, Generation } from '@dolittle/sdk.artifacts';
import { EventType } from './EventType';
import { EventTypeId } from './EventTypeId';

/**
 * Represents a map for mapping an event type to a given type and provide.
 * @template T Type to map to.
 */
export class EventTypeMap<T> extends ArtifactTypeMap<EventType, EventTypeId, T> {
    /**
     * Initializes a new instance of {@link EventTypeMap}
     */
    constructor() {
        super();
    }
    /** @inheritdoc */
    [Symbol.toStringTag] = 'EvenTypeMap';

    /** @inheritdoc */
    protected createArtifact(id: string, generation: Generation): EventType {
        return new EventType(EventTypeId.from(id), generation);
    }

}

// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';
import { Guid } from '@dolittle/rudiments';
import { Generation } from './Generation';
import { EventType } from './EventType';
import { IEventTypes } from './IEventTypes';
import { EventTypeId } from './EventTypeId';

export type EventTypesBuilderCallback = (builder: EventTypesBuilder) => void;

/**
 * Represents a builder for adding associations into {@link IEventTypes} instance.
 */
export class EventTypesBuilder {
    private _associations: [Constructor<any>, EventType][] = [];

    /**
     * Associate a type with an unique event type identifier and optional generation.
     * @param {Constructor} type Type to associate.
     * @param {ArtifactId} identifier Identifier to associate with.
     * @param {number} generation Optional generation - defaults to 1.
     */
    associate(type: Constructor<any>, identifier: EventTypeId | Guid | string, generation = Generation.first): EventTypesBuilder {
        this._associations.push([type, new EventType(EventTypeId.from(identifier), generation)]);
        return this;
    }

    /**
     * Build an artifacts instance.
     * @returns {IArtifacts} Artifacts to work with.
     */
    addAssociationsInto(eventTypes: IEventTypes): void {
        for (const [type, eventType] of this._associations) {
            eventTypes.associate(type, eventType);
        }
    }
}

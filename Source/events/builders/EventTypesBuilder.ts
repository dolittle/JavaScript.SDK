// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';
import { Guid } from '@dolittle/rudiments';
import { Generation } from '@dolittle/sdk.artifacts';

import { EventType } from '../EventType';
import { IEventTypes } from '../IEventTypes';
import { EventTypeId } from '../EventTypeId';
import { EventTypesFromDecorators } from '../EventTypesFromDecorators';

export type EventTypesBuilderCallback = (builder: EventTypesBuilder) => void;

/**
 * Represents a builder for adding associations into {@link IEventTypes} instance.
 */
export class EventTypesBuilder {
    private _associations: [Constructor<any>, EventType][] = [];

    /**
     * Associate a type with an unique event type identifier and optional generation.
     * @param {Constructor} type Type to associate.
     * @param {EventType} eventType EventType to associate with.
     */
    associate<T = any>(type: Constructor<T>, eventType: EventType): EventTypesBuilder;
    /**
     * Associate a type with an unique event type identifier and optional generation.
     * @param {Constructor} type Type to associate.
     * @param {EventTypeId | Guid | string} identifier Identifier to associate with.
     */
    associate<T = any>(type: Constructor<T>, identifier: EventTypeId | Guid | string): EventTypesBuilder;
    /**
     * Associate a type with an unique event type identifier and optional generation.
     * @param {Constructor} type Type to associate.
     * @param {EventTypeId | Guid | string} identifier Identifier to associate with.
     * @param {Generation | number} generation The generation to associate with.
     */
    associate<T = any>(type: Constructor<T>, identifier: EventTypeId | Guid | string, generation: Generation | number): EventTypesBuilder;
    associate<T = any>(type: Constructor<T>, eventTypeOrIdentifier: EventType | EventTypeId | Guid | string, generation?: Generation | number): EventTypesBuilder {
        const eventType = eventTypeOrIdentifier instanceof EventType ?
                            eventTypeOrIdentifier
                            : new EventType(
                                EventTypeId.from(eventTypeOrIdentifier),
                                generation ? Generation.from(generation) : Generation.first);
        this._associations.push([type, eventType]);
        return this;
    }

    /**
     * Register the type as an {@link EventType}.
     * @param type The type to register as an {@link EventType}
     */
    register<T = any>(type: Constructor<T>): EventTypesBuilder {
        this.associate(type, EventTypesFromDecorators.eventTypes.getFor(type));
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

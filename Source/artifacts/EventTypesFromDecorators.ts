// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';
import { Generation } from './Generation';
import { EventTypeId } from './EventTypeId';
import { EventType } from './EventType';
import { EventTypes } from './EventTypes';

/**
 * Represents event types coming from decorators.
 */
export class EventTypesFromDecorators {
    static readonly eventTypes = new EventTypes();

    /**
     * Associate a type with a unique artifact identifier and optional generation.
     * @param {Constructor} type Type to associate.
     * @param {ArtifactId} identifier Identifier to associate with.
     * @param {number} generation Optional generation - defaults to 0.
     */
    static associate(type: Constructor<any>, identifier: EventTypeId, generation: Generation = Generation.first): void {
        this.eventTypes.associate(type, new EventType(identifier, generation));
    }
}

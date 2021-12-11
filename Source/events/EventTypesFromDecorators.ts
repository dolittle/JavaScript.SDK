// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';
import { Generation } from '@dolittle/sdk.artifacts';
import { EventTypeId } from './EventTypeId';
import { EventType } from './EventType';
import { EventTypes } from './EventTypes';
import { EventTypeAlias } from './EventTypeAlias';

/**
 * Represents event types coming from decorators.
 */
export class EventTypesFromDecorators {
    static readonly eventTypes = new EventTypes();

    /**
     * Associate a type with a unique artifact identifier and optional generation.
     * @param {Constructor} type - Type to associate.
     * @param {EventTypeId} identifier - Identifier to associate with.
     * @param {Generation} generation - The generation to associate with.
     * @param {EventTypeAlias} alias - The alias to associate with the event type.
     */
    static associate(type: Constructor<any>, identifier: EventTypeId, generation: Generation, alias: EventTypeAlias): void {
        this.eventTypes.associate(type, new EventType(identifier, generation, alias));
    }
}

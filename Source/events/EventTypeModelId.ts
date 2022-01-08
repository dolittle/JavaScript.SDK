// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Generation } from '@dolittle/sdk.artifacts';
import { createIsModelIdentifier, ModelIdentifier } from '@dolittle/sdk.common';
import { AnyIdentifier } from '@dolittle/sdk.common/Model/Identifier';

import { EventType, isEventType } from './EventType';
import { EventTypeId, isEventTypeId } from './EventTypeId';

/**
 * Represents the identifier of an event type in an application model.
 */
export class EventTypeModelId extends ModelIdentifier<EventTypeId, '@dolittle/sdk.events.EventTypeModelId', { eventType: EventType }> {
    protected [Symbol.toStringTag]: string;
    /**
     * Initialises a new instance of the {@link EventTypeModelId} class.
     * @param {EventType} eventType - The event type.
     */
    constructor(eventType: EventType) {
        super(eventType.id, '@dolittle/sdk.events.EventTypeModelId', { eventType });
    }

    /**
     * Gets the event type of the identifier.
     */
    get eventType(): EventType {
        return this.__extras.eventType;
    }

    /**
     * Gets the generation of the identifier.
     */
    get generation(): Generation {
        return this.eventType.generation;
    }

    /** @inheritdoc */
    canCoexistWith(identifier: AnyIdentifier): boolean {
        if (!isEventTypeModelId(identifier)) return false;

        return this.id.equals(identifier.id) && !this.generation.equals(identifier.generation);
    }

    /** @inheritdoc */
    protected [Symbol.toStringTag] = 'EventType';

    /** @inheritdoc */
    protected toStringExtras(extras: { eventType: EventType }): object {
        return { generation: this.eventType.generation };
    }
}

/**
 * Checks whether or not an object is an instance of {@link EventTypeModelId}.
 * @param {any} object - The object to check.
 * @returns {boolean} True if the object is an {@link EventTypeModelId}, false if not.
 */
export const isEventTypeModelId = createIsModelIdentifier(
    EventTypeModelId,
    isEventTypeId,
    '@dolittle/sdk.events.EventTypeModelId',
    { eventType: isEventType });

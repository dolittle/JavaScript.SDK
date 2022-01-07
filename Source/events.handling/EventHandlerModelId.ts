// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { createIsModelIdentifier, ModelIdentifier } from '@dolittle/sdk.common';
import { isScopeId, ScopeId } from '@dolittle/sdk.events';

import { EventHandlerId, isEventHandlerId } from './EventHandlerId';

/**
 * Represents the identifier of an event handler in an application model.
 */
export class EventHandlerModelId extends ModelIdentifier<EventHandlerId, '@dolittle/sdk.events.handling.EventHandlerModelId', { scope: ScopeId }> {
    /**
     * Initialises a new instance of the {@link EventHandlerModelId} class.
     * @param {EventHandlerId} id - The event handler id.
     * @param {ScopeId} scope - The scope id.
     */
    constructor(id: EventHandlerId, scope: ScopeId) {
        super(id, '@dolittle/sdk.events.handling.EventHandlerModelId', { scope });
    }

    /**
     * Gets the scope of the identifier.
     */
    get scope(): ScopeId {
        return this.__extras.scope;
    }
}

/**
 * Checks whether or not an object is an instance of {@link EventHandlerModelId}.
 * @param {any} object - The object to check.
 * @returns {boolean} True if the object is an {@link EventHandlerModelId}, false if not.
 */
export const isEventHandlerModelId = createIsModelIdentifier(
    EventHandlerModelId,
    isEventHandlerId,
    '@dolittle/sdk.events.handling.EventHandlerModelId',
    { scope: isScopeId });

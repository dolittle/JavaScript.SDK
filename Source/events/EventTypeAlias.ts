// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ConceptAs, createIsConceptAsString } from '@dolittle/concepts';

/**
 * Defines the types that can be converted to a {@link EventTypeAlias}.
 */
export type EventTypeAliasLike = string | EventTypeAlias;

/**
 * Represents the alias of an event type.
 */
export class EventTypeAlias extends ConceptAs<string, '@dolittle/sdk.events.EventTypeAlias'> {
    /**
     * Initialises a new instance of the {@link EventTypeAlias} class.
     * @param {string} alias - The event type alias.
     */
    constructor(alias: string) {
        super(alias, '@dolittle/sdk.events.EventTypeAlias');
    }
    /**
     * Creates an {@link EventTypeAlias} from a {@link string}.
     * @param {EventTypeAliasLike} id - The event type alias.
     * @returns {EventTypeAlias} The created event type alias concept.
     */
    static from(id: EventTypeAliasLike): EventTypeAlias {
        if (id instanceof EventTypeAlias) return id;
        return new EventTypeAlias(id);
    }
};

/**
 * Checks whether or not an object is an instance of {@link EventTypeAlias}.
 * @param {any} object - The object to check.
 * @returns {boolean} True if the object is an {@link EventTypeAlias}, false if not.
 */
export const isEventTypeAlias = createIsConceptAsString(EventTypeAlias, '@dolittle/sdk.events.EventTypeAlias');

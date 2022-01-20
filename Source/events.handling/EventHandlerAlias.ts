// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ConceptAs } from '@dolittle/concepts';

/**
 * Defines the types that can be converted to an {@link EventHandlerAlias}.
 */
export type EventHandlerAliasLike = string | EventHandlerAlias;

/**
 * Represents the alias for a EventHandler.
 */
export class EventHandlerAlias extends ConceptAs<string, '@dolittle/sdk.events.handling.EventHandlerAlias'> {
    /**
     * Initialises a new instance of the {@link EventHandlerAlias} class.
     * @param {string} alias - The event handler alias.
     */
    constructor(alias: string) {
        super(alias, '@dolittle/sdk.events.handling.EventHandlerAlias');
    }

    /**
     * Creates an {@link EventHandlerAlias} from an {@link EventHandlerAliasLike}.
     * @param {EventHandlerAliasLike} alias - The event handler alias.
     * @returns {EventHandlerAlias} The created event handler alias concept.
     */
    static from(alias: EventHandlerAliasLike): EventHandlerAlias {
        if (alias instanceof EventHandlerAlias) return alias;
        return new EventHandlerAlias(alias);
    }
}

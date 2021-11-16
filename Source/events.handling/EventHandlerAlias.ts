// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ConceptAs } from '@dolittle/concepts';

/**
 *
 */
export type EventHandlerAliasLike = string | EventHandlerAlias;

/**
 * Represents the alias for a EventHandler.
 */
export class EventHandlerAlias extends ConceptAs<string, '@dolittle/sdk.events.handling.EventHandlerAlias'> {
    constructor(alias: string) {
        super(alias, '@dolittle/sdk.events.handling.EventHandlerAlias');
    }

    /**
     * Creates an {EventHandlerAlias} from a string.
     *
     * @static
     * @param {EventHandlerAliasLike} alias
     * @returns {EventHandlerAlias}
     */
    static from(alias: EventHandlerAliasLike): EventHandlerAlias {
        if (alias instanceof EventHandlerAlias) return alias;
        return new EventHandlerAlias(alias);
    }
}

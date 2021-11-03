// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ConceptAs } from '@dolittle/concepts';

export type EventTypeAliasLike = string | EventTypeAlias;

/**
 * Represents the alias of an event type.
 *
 * @export
 * @class EventTypeAlias
 * @extends {ConceptAs<string, '@dolittle/sdk.artifacts.EventTypeId'>}
 */
export class EventTypeAlias extends ConceptAs<string, '@dolittle/sdk.artifacts.EventTypeAlias'> {
    constructor(alias: string) {
        super(alias, '@dolittle/sdk.artifacts.EventTypeAlias');
    }
    /**
     * Creates an {@link EventTypeAlias} from a guid.
     *
     * @static
     * @param {(Guid | string)} id
     * @returns {EventSourceId}
     */
    static from(id: EventTypeAliasLike): EventTypeAlias {
        if (id instanceof EventTypeAlias) return id;
        return new EventTypeAlias(id);
    }
};

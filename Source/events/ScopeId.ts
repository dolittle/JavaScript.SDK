// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { ConceptAs, createIsConceptAsGuid } from '@dolittle/concepts';

/**
 * Represents the unique identifier of a scope.
 */
export class ScopeId extends ConceptAs<Guid, '@dolittle/sdk.events.ScopeId'> {
    /**
     * Initialises a new instance of the {@link ScopeId} class.
     * @param {Guid} id - The scope id.
     */
    constructor(id: Guid) {
        super(id, '@dolittle/sdk.events.ScopeId');
    }

    /**.
     * Represents the default scope
     *
     * @static
     * @type {ScopeId}
     */
    static default: ScopeId = ScopeId.from(Guid.empty);

    /**
     * Creates a {@link ScopeId} from a {@link Guid} or a {@link string}.
     * @param {ScopeId | Guid | string} id - The scope id.
     * @returns {ScopeId} The created scope id concept.
     */
    static from(id: ScopeId | Guid | string): ScopeId {
        if (id instanceof ScopeId) return id;
        return new ScopeId(Guid.as(id));
    }
};

/**
 * Checks whether or not an object is an instance of {@link ScopeId}.
 * @param {any} object - The object to check.
 * @returns {boolean} True if the object is an {@link ScopeId}, false if not.
 */
export const isScopeId = createIsConceptAsGuid(ScopeId, '@dolittle/sdk.events.ScopeId');

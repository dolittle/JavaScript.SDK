// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { ConceptAs } from '@dolittle/concepts';

/**
 * Represents the unique identifier of a scope.
 */
export class ScopeId extends ConceptAs<Guid, '@dolittle/sdk.events.ScopeId'> {
    constructor(id: Guid) {
        super(id, '@dolittle/sdk.events.ScopeId');
    }

    /**
     * Represents the default scope
     *
     * @static
     * @type {ScopeId}
     */
    static default: ScopeId = ScopeId.from(Guid.empty);

    /**
     * Creates a {ScopeId} from a guid.
     *
     * @static
     * @param {(Guid | string)} [id]
     * @returns {ScopeId}
     */
    static from(id: Guid | string): ScopeId {
        return new ScopeId(Guid.as(id));
    }
};

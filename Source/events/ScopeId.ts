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
    static create(id?: Guid | string): ScopeId {
        return new ScopeId(id != null ? Guid.as(id) : Guid.create());
    }
};


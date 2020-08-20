// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';
import { ScopeId } from '@dolittle/sdk.events';
import { FilterId } from './FilterId';

/**
 * Exception that is thrown when a filter callback is not defined.
 */
export class MissingFilterCallback extends Exception {

    /**
     * Initializes a new instance of {@link MissingFilterCallback}.
     * @param {FilterId} filterId Identifier of the filter.
     * @param {ScopeId} scopeId Scope the filter is in.
     */
    constructor(filterId: FilterId, scopeId: ScopeId) {
        super(`Filter callback is not configured for filter '${filterId}' in scope ${scopeId}`);
    }
}

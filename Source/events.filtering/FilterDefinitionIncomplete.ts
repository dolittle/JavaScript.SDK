// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';
import { FilterId } from './FilterId';

/**
 * Exception that is thrown when a filter definition is started using the {@link EventFiltersBuilder}, but not completed..
 */
export class FilterDefinitionIncomplete extends Exception {

    /**
     * Initializes a new instance of {@link FilterDefinitionIncomplete}.
     * @param {FilterId} filterId - Identifier of the filter.
     * @param {string} action - Suggested action to complete the definition.
     */
    constructor(filterId: FilterId, action: string) {
        super(`Filter definition for filter '${filterId}' is incomplete: ${action}`);
    }
}

// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { createIsModelIdentifier, ModelIdentifier } from '@dolittle/sdk.common';
import { isScopeId, ScopeId } from '@dolittle/sdk.events';

import { FilterId, isFilterId } from './FilterId';

/**
 * Represents the identifier of a filter in an application model.
 */
export class FilterModelId extends ModelIdentifier<FilterId, '@dolittle/sdk.events.filtering.FilterModelId', { scope: ScopeId }> {
    /**
     * Initialises a new instance of the {@link FilterModelId} class.
     * @param {FilterId} id - The filter id.
     * @param {ScopeId} scope - The scope id.
     */
    constructor(id: FilterId, scope: ScopeId) {
        super(id, '@dolittle/sdk.events.filtering.FilterModelId', { scope });
    }
}

/**
 * Checks whether or not an object is an instance of {@link FilterModelId}.
 * @param {any} object - The object to check.
 * @returns {boolean} True if the object is an {@link FilterModelId}, false if not.
 */
export const isFilterModelId = createIsModelIdentifier(
    FilterModelId,
    isFilterId,
    '@dolittle/sdk.events.filtering.FilterModelId',
    { scope: isScopeId });

// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';

import { FilterId } from './FilterId';
import { PrivateEventFilterBuilderCallback } from './PrivateEventFilterBuilderCallback';
import { PublicEventFilterBuilderCallback } from './PublicEventFilterBuilderCallback';

/**
 * Defines a builder for building event filters.
 */
export abstract class IEventFiltersBuilder {
    /**
     * Start building for a specific filter.
     * @param {FilterId | Guid | string} filterId - The identifier of the filter.
     * @param {PrivateEventFilterBuilderCallback} callback - Callback for building the event filter.
     * @returns {IEventFiltersBuilder} Continuation of the builder.
     */
    abstract createPrivateFilter(filterId: FilterId | Guid | string, callback: PrivateEventFilterBuilderCallback): IEventFiltersBuilder;

    /**
     * Start building for a specific filter.
     * @param {FilterId | Guid | string} filterId - The identifier of the filter.
     * @param {PublicEventFilterBuilderCallback} callback - Callback for building the event filter.
     * @returns {IEventFiltersBuilder} Continuation of the builder.
     */
    abstract createPublicFilter(filterId: FilterId | Guid | string, callback: PublicEventFilterBuilderCallback): IEventFiltersBuilder;
}
